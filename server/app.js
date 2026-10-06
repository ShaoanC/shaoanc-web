const express = require('express');

const app = express();

app.get('/api/hello', (req, res) => {
    res.json({
        success: true,
        message: 'Hello from shaoanc.cn API!'
    });
});

app.listen(3000, '127.0.0.1', () => {
    console.log('API running at http://127.0.0.1:3000');
});