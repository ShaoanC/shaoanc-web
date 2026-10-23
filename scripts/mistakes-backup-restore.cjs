const path = require('node:path');
require('dotenv').config({ path: process.env.MISTAKES_ENV_PATH || path.join(__dirname, '..', '.env'), quiet: true });
const { restoreBackup } = require('../server/mistakes/backup-restore');

async function main() {
    const argumentsList = process.argv.slice(2);
    const filename = argumentsList.find((argument) => !argument.startsWith('--'));
    if (!filename || !argumentsList.includes('--confirm') || argumentsList.some((argument) => argument.startsWith('--') && argument !== '--confirm')) {
        throw new Error('用法：npm run backup:restore -- <备份包.tar.gz> --confirm（请先停止服务）');
    }
    const result = await restoreBackup(filename, { confirm: true });
    console.log('数据、图片和配置已恢复。登录会话已清空，未完成的 AI 和裁图任务可手动重试。');
    if (result.rollbackBackup) console.log(`恢复前回退包：${result.rollbackBackup}`);
    console.log('现在可以重新启动服务。');
}

main().catch((error) => {
    console.error(`恢复失败：${error.message}`);
    process.exitCode = 1;
});
