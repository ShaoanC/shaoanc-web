const express = require('express');
const { loadSession, requireUser, requireAdmin } = require('./auth');
const { isReadOnly } = require('./backup-coordination');

function createBackupRouter(getService) {
    const router = express.Router();
    const success = (res, data, status = 200) => res.status(status).json({ success: true, data });
    router.use((req, res, next) => {
        if (req.path !== '/system/status' && !req.path.startsWith('/admin/backups')) return next('router');
        res.set('Cache-Control', 'no-store');
        next();
    });
    router.use(loadSession, requireUser);
    router.get('/system/status', (req, res) => success(res, { readOnly: isReadOnly() }));
    router.use('/admin/backups', requireAdmin);
    router.get('/admin/backups', (req, res) => success(res, getService().list()));
    router.post('/admin/backups', (req, res) => success(res, getService().create(), 202));
    router.get('/admin/backups/settings', (req, res) => success(res, getService().getSettings()));
    router.patch('/admin/backups/settings', (req, res) => success(res, getService().saveSettings(req.body || {})));
    router.get('/admin/backups/:id/download', (req, res, next) => {
        const filename = getService().download(req.params.id);
        res.download(filename, undefined, (error) => { if (error) next(error); });
    });
    router.delete('/admin/backups/:id', (req, res) => success(res, getService().remove(req.params.id)));
    return router;
}

module.exports = { createBackupRouter };
