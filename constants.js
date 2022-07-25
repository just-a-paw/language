const { getLocaleDirents } = require('./util');

exports.locales = getLocaleDirents().map(e => e.name);
exports.sourceLocale = 'en-GB';
exports.localeConfigName = 'locale';