const { db } = require('./database');
const { invalidateUser } = require('./search');

const TRASH_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

function cleanupExpiredTrash(now = Date.now(), userId) {
    const cutoff = new Date(now - TRASH_RETENTION_MS).toISOString();
    const where = 'deleted_at IS NOT NULL AND deleted_at <= ?' + (userId === undefined ? '' : ' AND user_id = ?');
    const parameters = userId === undefined ? [cutoff] : [cutoff, userId];
    const result = db.transaction(() => {
        const users = db.prepare(`SELECT DISTINCT user_id FROM mistakes WHERE ${where}`).all(...parameters);
        const deleted = db.prepare(`DELETE FROM mistakes WHERE ${where}`).run(...parameters);
        return { users, count: deleted.changes };
    })();
    for (const user of result.users) {
        invalidateUser(user.user_id);
    }
    return result.count;
}

module.exports = { cleanupExpiredTrash, TRASH_RETENTION_MS };
