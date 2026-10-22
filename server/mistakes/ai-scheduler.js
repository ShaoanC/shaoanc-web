// Delayed retries stay outside p-queue so they do not occupy an execution slot.
function createTaskScheduler({ getTask, getRunner, run, onError }) {
    const entries = new Map();
    let stopped = false;

    function schedule(id) {
        if (stopped || entries.has(id)) return;
        const task = getTask(id);
        if (!task || !['queued', 'retrying'].includes(task.status)) return;
        const entry = { timer: null, promise: null };
        entries.set(id, entry);
        const delay = Math.max(0, Date.parse(task.next_attempt_at || '') - Date.now()) || 0;
        if (delay) entry.timer = setTimeout(() => { entry.timer = null; dispatch(id, entry); }, delay);
        else dispatch(id, entry);
    }

    function dispatch(id, entry) {
        entry.promise = (async () => {
            try {
                const task = getTask(id);
                if (stopped || !task || !['queued', 'retrying'].includes(task.status)) return;
                const runner = await getRunner(task.user_id);
                if (!stopped) await runner.queue.add(() => run(id, runner));
            } catch (error) {
                if (!stopped) onError(id, error);
            } finally {
                if (entries.get(id) === entry) entries.delete(id);
                if (!stopped && getTask(id)?.status === 'retrying') schedule(id);
            }
        })();
    }

    function cancel(id) {
        const entry = entries.get(id);
        if (entry?.timer) {
            clearTimeout(entry.timer);
            entries.delete(id);
        }
    }

    async function stop() {
        stopped = true;
        for (const id of entries.keys()) cancel(id);
        await Promise.all([...entries.values()].map((entry) => entry.promise));
    }

    return { schedule, cancel, stop, resume: () => { stopped = false; }, has: (id) => entries.has(id) };
}

function retryDelay(error, attempts) {
    const retryAfter = error.headers?.get?.('retry-after');
    const serverWait = retryAfter ? (Number.isFinite(Number(retryAfter)) ? Number(retryAfter) * 1000 : Date.parse(retryAfter) - Date.now()) : 0;
    return Math.max(2000 * 2 ** (attempts - 1), Math.min(serverWait || 0, 120000));
}

module.exports = { createTaskScheduler, retryDelay };
