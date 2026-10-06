require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/api/hello', (req, res) => {
    res.json({
        success: true,
        message: 'Hello from shaoanc.cn API!'
    });
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running on 127.0.0.1:${PORT}`);
});