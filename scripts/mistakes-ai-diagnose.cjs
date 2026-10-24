const path = require('node:path');
require('dotenv').config({ path: process.env.MISTAKES_ENV_PATH || path.join(__dirname, '..', '.env'), quiet: true });

// Reuse the saved configuration and production request without touching application data.
process.env.MISTAKES_DB_PATH = ':memory:';
const { db } = require('../server/mistakes/database');
const { testVision } = require('../server/mistakes/ai-vision-test');
const { safeAiError } = require('../server/mistakes/ai-config');

async function run() {
    const profile = process.argv[2] || 'segmentation';
    try {
        if (!['general', 'segmentation', 'analysis'].includes(profile)) {
            throw new Error('Usage: npm run diagnose:ai -- [segmentation|general|analysis]');
        }
        const result = await testVision(profile);
        console.log(result.message);
    } catch (error) {
        console.error(safeAiError(error, { details: true }));
        process.exitCode = 1;
    } finally {
        db.close();
    }
}

run();
