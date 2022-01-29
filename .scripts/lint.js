'use strict';

const fs = require('node:fs');
const glob = require('glob');
const { format, resolveConfigFile, resolveConfig } = require('prettier');

const config = resolveConfig.sync(resolveConfigFile.sync());
for (const file of glob.sync('./??/*.json')) {
  const content = fs.readFileSync(file).toString();
  const parsed = JSON.parse(content); // parsable? good enough
  if (process.argv.slice(2).includes('--fix')) {
    const sorted = recursiveSort(parsed);
    const data = JSON.stringify(sorted, null, 2);
    const formatted = format(data, { ...config, parser: 'json' });
    fs.writeFileSync(file, formatted);
  }
}

function recursiveSort(object) {
  const sorted = {};
  for (
    const key of Object
      .keys(object)
      .sort(
        (a, b) => a.normalize().localeCompare(b.normalize())
      )
  ) {
    if (object[key] && typeof object[key] === 'object' && !Array.isArray(object[key])) {
      sorted[key] = recursiveSort(object[key])
    } else sorted[key] = object[key];
  }
  return sorted;
}