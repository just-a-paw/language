// @ts-nocheck
'use strict';

const data = require('../index');
const dot = require('dot-object');
const fs = require('node:fs');

// ignore config files
for (const code in data) delete data[code].locale;
const english = new Intl.DisplayNames('en', { type: 'language' });
const text = [];

for (const code in data) {
  const summary = {
    missing: [],
    noent: [],
  };
  for (const key in dot.dot(data.en)) {
    if (!dot.pick(key, data[code])) {
      summary.missing.push(key);
    }
  }
  for (const key in dot.dot(data[code])) {
    const origin = dot.pick(key, data.en);
    if (!origin) {
      summary.noent.push(key);
    }
  }
  if (code !== 'en') {
    const display = new Intl.DisplayNames(code, { type: 'language' });
    text.push(
      `## \`${code}\` ${english.of(code)} (${display.of(code).replace(/./, r => r.toUpperCase())})${
        summary.missing.length === 0 && summary.noent.length === 0 ? '\n\nCompleted locale.' : `${
        summary.missing.length !== 0 ? `\n\nMissing the following entries:\n\n${summary.missing.map(t => `* \`${t}\``).join('\n')}` : ''}${
        summary.noent.length !== 0 ? `\n\nContains deprecated entries:\n\n${summary.noent.map(t => `* \`${t}\``).join('\n')}` : ''
      }`}`
    );
  }
}

fs.writeFileSync('./AGGREGATE.md',
  fs.readFileSync('./AGGREGATE.md')
    .toString()
    .replace(
      /<!-- BLOCK AGGREGATE BEGIN -->[\s\S]+<!-- BLOCK AGGREGATE END -->/,
      '<!-- BLOCK AGGREGATE BEGIN -->\n\n' + text.join('\n\n') + '\n\n<!-- BLOCK AGGREGATE END -->'
    )
)