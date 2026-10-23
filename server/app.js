const path = require('node:path');
require('dotenv').config({ path: process.env.MISTAKES_ENV_PATH || path.join(__dirname, '..', '.env') });

const express = require('express');
const { acquireRuntimeLock } = require('./mistakes/runtime-lock');
if (require.main === module) {
    const release = acquireRuntimeLock(process.env.MISTAKES_DB_PATH || path.join(__dirname, '..', 'data', 'mistakes.sqlite'));
    process.on('exit', release);
}
const { db } = require('./mistakes/database');
const mistakesRouter = require('./mistakes/router');
const { cleanupExpiredTrash } = require('./mistakes/trash');
const { assertWritable } = require('./mistakes/backup-coordination');
const { createBackupService } = require('./mistakes/backups');
const { createBackupRouter } = require('./mistakes/backup-router');
const ai = require('./mistakes/ai');
let backups;
const app = express();

const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.set('trust proxy', 'loopback');
app.use(express.json({ limit: '1mb' }));
app.get('/api/hello', (req, res) => {
    res.json({
        success: true,
        message: 'Hello from shaoanc.cn API!'
    });
});

// Construct lazily: unrelated API reads do not create a backup directory.
const backupService = () => {
    if (!backups) backups = createBackupService({ db, pauseJobs: ai.pauseJobs, resumeJobs: ai.resumeJobs });
    return backups;
};
const backupRouter = createBackupRouter(backupService);
app.use('/api/mistakes', (req, res, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && !/^\/admin\/backups(?:\/|$)/.test(req.path)) assertWritable();
    next();
}, backupRouter, mistakesRouter);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: '接口不存在' });
});
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    const status = error.status || 500;
    if (status >= 500 && !error.expose) {
        console.error(error);
    }
    res.status(status).json({
        success: false,
        message: status >= 500 && !error.expose ? '服务暂时不可用，请稍后重试' : error.message,
        ...(error.code ? { code: error.code } : {})
    });
});

if (require.main === module) {
    cleanupExpiredTrash();
    ai.recoverJobs();
    backupService().start();
    setInterval(() => {
        try {
            cleanupExpiredTrash();
        } catch (error) {
            console.error('Failed to clean expired trash:', error);
        }
    }, 60 * 60 * 1000).unref();
    app.listen(PORT, '127.0.0.1', () => {
        console.log(`Server running on 127.0.0.1:${PORT}`);
    });
}

module.exports = app;
module.exports.db = db;
module.exports.getBackupService = backupService;
