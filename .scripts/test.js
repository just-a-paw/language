// @ts-nocheck
'use strict';

const data = require('../index');
const cldrData = require('cldr-data');
const dot = require('dot-object');

if (!data.en) throw new Error('English localisation does not exist');
// ignore config files
for (const code in data) delete data[code].locale;

const stats = {
  warn: 0,
};

function error(message) {
  console.error(message);
  process.exit(1);
}

function warn(message) {
  console.warn(message);
  stats.warn++;
}

for (const code in data) {
  if (code.length !== 2) error(`Directory must only contain folders with ISO 639-1 names.`);
  if (!cldrData.availableLocales.includes(code)) error(`Language code "${code}" is not a valid ISO 639-1 code.`);
  if (code !== 'en') {
    for (const key in dot.dot(data.en)) {
      if (!dot.pick(key, data[code])) {
        warn(
          `${code}: Entry is missing: ${key}\n` +
          `Missing entries in a locale are automatically redirected to the existing English entry.`
        );
      }
    }
    for (const [key, entry] of Object.entries(dot.dot(data[code]))) {
      const origin = dot.pick(key, data.en);
      if (!origin) {
        warn(
          `${code}: Entry should not exist: ${key}\n` +
          `This entry is no longer in use or may be a typo.`
        );
      } else if (typeof origin !== typeof entry) {
        warn(`${code}: Entry should be type of "${typeof origin}", but got "${typeof entry}": ${key}`);
      }
    }
  }
}

if (stats.warn) console.log(`\nFinished with ${stats.warn} warnings.`);
process.exit(0);