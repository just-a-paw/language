'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { isDeepStrictEqual } = require('node:util');
const { format, resolveConfigFile, resolveConfig, check } = require('prettier');
const mri = require('mri');
const { getLocaleFiles } = require('../util');
const { locales } = require('../constants');

const base = path.resolve(__dirname, '..');

const recursiveSort = object => {
  const sorted = {};

  for (
    const key of Object
      .keys(object)
      .sort((a, b) => a.normalize().localeCompare(b.normalize()))
  ) {
    if (object[key] && typeof object[key] === 'object' && !Array.isArray(object[key])) {
      sorted[key] = recursiveSort(object[key])
    } else sorted[key] = object[key];
  }

  return sorted;
};

const run = () => {
  const options = mri(process.argv.slice(2));
  const configPath = resolveConfigFile.sync(base);
  if (!configPath) throw Error('.prettierrc not found. Did you accidentally delete it?');
  const config = resolveConfig.sync(configPath);

  let unformattedFiles = false;
  for (const file of getLocaleFiles(locales)) {
    const filename = `${file}.json`;
    const filepath = path.join(base, filename);
    const content = fs.readFileSync(filepath, 'utf8');
    const data = require(`../${file}.json`);
    let sorted = recursiveSort(data);

    if (options.fix) {
      const str = JSON.stringify(sorted, null, 2);
      const formatted = format(str, { ...config, filepath });
      fs.writeFileSync(filepath, formatted);
    } else {
      if (!check(content, { ...config, filepath }) || !isDeepStrictEqual(data, sorted)) {
        console.warn(filename);
        unformattedFiles = true;
      }
    }
  }

  if (unformattedFiles) {
    console.warn('Unformatted files found. Try running lint:fix');
    process.exitCode = 1;
  }
}

run();