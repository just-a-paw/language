// @ts-nocheck
'use strict';

const path = require('node:path');
const { readFileSync } = require('node:fs');
const { parseExpression } = require('@babel/parser');
const data = require('../data');
const dot = require('dot-object');
const { sourceLocale } = require('../constants');
const { findJsonNode, getLocaleFiles } = require('../util');

const base = path.resolve(__dirname, '..');

const formatLineFragment = (start, end) => `L${start}${end && end !== start ? `-L${end}` : ''}`;

const uriEncodeFilename = filename => filename.split(path.sep).map(encodeURIComponent).join('/');

const formatEntryInfo = (locale, entry) => {
  const info = this.entryInfo(locale, entry);
  const sourceInfo = this.entryInfo(sourceLocale, entry);
  const baseUrl = 'https://github.com/OfficialPawBot/language/blob/main/';

  let text = info ? `* [\`${entry}\`](${baseUrl}${uriEncodeFilename(info.filename)}#${formatLineFragment(info.start.line, info.end.line)})` :
    `* \`${entry}\``

  if (sourceInfo) text += ` [Source](${baseUrl}${uriEncodeFilename((sourceInfo.filename))}#${formatLineFragment(sourceInfo.start.line, sourceInfo.end.line)})`

  return text;
}

const astCache = {};
exports.entryInfo = (locale, entry) => {
  const entryKeys = entry.replace(/\[(-?\d+)\]/g, '.$1').split('.');
  for (const file of getLocaleFiles([locale])) {
    const keys = file.split(path.sep).slice(1);
    if (keys.some((v, i) => v !== entryKeys[i])) continue;
    const filename = `${file}.json`;
    let index = keys.length;

    const data = readFileSync(path.join(base, filename), 'utf8');
    const ast = astCache[filename] ??= parseExpression(data, {
      ranges: true,
      sourceFilename: filename,
    });
    if (index === entryKeys.length) return ast.loc;

    const node = findJsonNode(ast, entryKeys, index);
    return node?.loc;
  }
}

exports.aggregate = locale => {
  const summary = {
    missing: [],
    noent: [],
  };

  for (const key in dot.dot(data[sourceLocale]))
    if (!dot.pick(key, data[locale]))
      summary.missing.push(key);

  for (const key in dot.dot(data[locale])) {
    const origin = dot.pick(key, data[sourceLocale]);
    if (!origin) summary.noent.push(key);
  }

  const text = [];
  if (summary.missing.length === 0 && summary.noent.length === 0) return 'This locale is fully translated, but may require further proofreading.';
  else {
    if (summary.missing.length !== 0) text.push(`Missing the following entries:\n\n${summary.missing.map(t => formatEntryInfo(locale, t)).join('\n')}`);
    if (summary.noent.length !== 0) text.push(`Contains deprecated entries:\n\n${summary.noent.map(t => formatEntryInfo(locale, t)).join('\n')}`);
  }

  return text.join('\n\n');
};