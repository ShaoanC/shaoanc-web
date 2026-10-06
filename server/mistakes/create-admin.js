require('dotenv').config();

const readline = require('node:readline/promises');
const { Writable } = require('node:stream');
const { db } = require('./database');
const { validateCredentials, hashPassword } = require('./auth');

async function promptCredentials() {
    let muted = false;
    const output = new Writable({
        write(chunk, encoding, callback) {
            if (!muted) {
                process.stdout.write(chunk, encoding);
            }
            callback();
        }
    });
    const input = readline.createInterface({ input: process.stdin, output, terminal: Boolean(process.stdin.isTTY) });
    try {
        const username = process.env.MISTAKES_ADMIN_USERNAME || await input.question('管理员用户名（3–32 字符）: ');
        let password = process.env.MISTAKES_ADMIN_PASSWORD;
        if (!password) {
            process.stdout.write('管理员密码（至少 8 字符，输入隐藏）: ');
            muted = true;
            password = await input.question('');
            muted = false;
            process.stdout.write('\n');
        }
        return { username: username.trim(), password };
    } finally {
        input.close();
    }
}

async function main() {
    try {
        const { username, password } = await promptCredentials();
        validateCredentials(username, password);
        if (db.prepare('SELECT id FROM users WHERE username = ?').get(username)) {
            throw new Error('用户名已存在，请使用其他用户名');
        }
        db.prepare("INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, 'admin', ?)")
            .run(username, hashPassword(password), new Date().toISOString());
        console.log(`管理员 ${username} 已创建。请登录后生成邀请码。`);
    } catch (error) {
        console.error(`创建失败：${error.message}`);
        process.exitCode = 1;
    } finally {
        db.close();
    }
}

if (require.main === module) {
    main();
}

module.exports = { main };
