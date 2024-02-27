const { getLocaleDirents } = require('./util');

exports.locales = getLocaleDirents().map(e => e.name);
exports.sourceLocale = 'en-GB';
exports.localeConfigName = 'locale';
exports.preferences = {
  // language disambiguation, e.g. if both `en-GB` and `en-US` exist, this should include:
  // en: "en-GB"
};