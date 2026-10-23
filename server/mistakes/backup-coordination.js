let readOnly = false;

function isReadOnly() {
    return readOnly;
}

function assertWritable() {
    if (readOnly) {
        throw Object.assign(new Error('正在备份，暂时无法保存，请稍后重试'), {
            status: 503, code: 'BACKUP_READ_ONLY', expose: true
        });
    }
}

function beginReadOnly() {
    assertWritable();
    readOnly = true;
}

function endReadOnly() {
    readOnly = false;
}

module.exports = { isReadOnly, assertWritable, beginReadOnly, endReadOnly };
