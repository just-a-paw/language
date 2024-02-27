'use strict';

const dot = require('dot-object');
const fs = require('node:fs');
const path = require('node:path');
const { getLocaleFiles, getLocaleDirents } = require('../util');
const { sourceLocale } = require('../constants');
const data = Object.assign({}, require('../data'));

const base = path.resolve(__dirname, '..');
const source = data[sourceLocale];
delete data[sourceLocale];

const deduplicate = () => {
  for (const file of getLocaleFiles(Object.keys(data))) {
    const split = file.split(path.sep);
    const baseDotPath = split.join('.');
    const code = split.shift();

    const deduplicated = {};
    const picked = dot.pick(baseDotPath, data);
    for (const [key, value] of Object.entries(dot.dot(picked))) {
      const fullDotPath = `${baseDotPath}.${key}`;
      if (value !== dot.pick(fullDotPath, { [code]: source }))
        dot.set(fullDotPath, value, deduplicated);
    }

    const locale = deduplicated[code];
    const fileWithExt = `${file}.json`;
    if (!locale) fs.rmSync(path.join(base, fileWithExt));
    else fs.writeFileSync(path.join(base, fileWithExt), JSON.stringify(dot.pick(baseDotPath, deduplicated), null, 2));
  }

  for (const ent of getLocaleDirents()) {
    const absolute = path.join(base, ent.name)
    if (ent.isDirectory() && !fs.readdirSync(absolute).length) fs.rmdirSync(absolute);
  }
};

deduplicate();