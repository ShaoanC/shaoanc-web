require('dotenv').config();

const path = require('node:path');
const express = require('express');
const { db } = require('./mistakes/database');
const mistakesRouter = require('./mistakes/router');
const app = express();

const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.get('/api/hello', (req, res) => {
    res.json({
        success: true,
        message: 'Hello from shaoanc.cn API!'
    });
});

app.use('/api/mistakes', mistakesRouter);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: '接口不存在' });
});
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    const status = error.status || 500;
    if (status >= 500) {
        console.error(error);
    }
    res.status(status).json({
        success: false,
        message: status >= 500 ? '服务暂时不可用，请稍后重试' : error.message
    });
});

if (require.main === module) {
    app.listen(PORT, '127.0.0.1', () => {
        console.log(`Server running on 127.0.0.1:${PORT}`);
    });
}

module.exports = app;
module.exports.db = db;
