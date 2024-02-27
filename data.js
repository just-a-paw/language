const path = require('node:path');
const { getLocaleFiles } = require('./util');
const { locales } = require('./constants');
const { existsSync } = require('node:fs');

for (const file of getLocaleFiles(locales)) {
  const data = require(`./${file}.json`);
  const keys = file.split(path.sep);
  if (keys.length === 1 && existsSync(path.join(path.resolve(__dirname), `${file}.locale.json`)))
    data.locale = require(`./${file}.locale.json`);
  let prop = exports;
  let key;
  while ((key = keys.shift()) && keys.length)
    prop = prop[key] ??= {};

  prop[key] = data;
}