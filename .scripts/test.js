// @ts-nocheck
'use strict';

const path = require('node:path');
const fs = require('node:fs');
const dot = require('dot-object')('/', undefined, undefined, false);
const Ajv = require('ajv');
const { parseExpression } = require('@babel/parser');
const { isLocale, getLocaleFiles, findJsonNode, getLocaleDirents } = require('../util');
const { locales, sourceLocale } = require('../constants');
const { [sourceLocale]: source } = require('../data');

const base = path.resolve(__dirname, '..');
const ajv = new Ajv({ allErrors: true, strict: false, logger: false });

if (!source) throw new Error('English localisation does not exist');

const stats = {
  warn: 0,
  error: 0,
};

function error(message) {
  console.error(`[error] ${message}`);
  stats.error++;
}

function warn(message) {
  console.error(`[warn] ${message}`);
  stats.warn++;
}

for (const code of locales) {
  if (!isLocale(code)) error(`Language code "${code}" is not valid for this project.`);
}

const validateJsonSchema = ajv.compile(require('../schema.json'));
const validateLocaleJsonSchema = ajv.compile(require('../locale.schema.json'));

const filterRelevantErrors = (error, _, errors) => {
  // filter less relevant keywords if there's a relvant keyword
  const excludedKeywords = ['type', 'oneOf'];
  if (excludedKeywords.includes(error.keyword) &&
    errors.filter(e => e.instancePath === error.instancePath && !excludedKeywords.includes(e.keyword)).length)
    return false;

  // filter to highest hierarchy
  for (const prop of ['instancePath', 'schemaPath'])
    for (const error2 of errors)
      if (error[prop].length < error2[prop].length &&
        `${error[prop]}/` === error2[prop].slice(0, error[prop].length + 1))
        return false;

  return true;
}

const astCache = {};
const printAjvErrors = (errors, filename, ast) => {
  for (const info of errors.filter(filterRelevantErrors)) {
    let location = '';
    if (info.instancePath) {
      const node = findJsonNode(ast, info.instancePath.slice(1).split('/'), 0);
      if (node) location = `:${node.loc.start.line}:${node.loc.start.column + 1}`
    };

    error(`${filename}${location}${info.instancePath} ${info.message}`)
  }
}

for (const file of getLocaleFiles(locales)) {
  const filename = `${file}.json`;
  const absolute = path.join(base, filename);
  const parts = file.split(path.sep);
  parts.shift();

  const data = require(`../${filename}`);
  const raw = fs.readFileSync(absolute, 'utf8');
  const isLocaleFile = parts[0] === 'locale' && parts.length === 1;
  const validator = isLocaleFile ? validateLocaleJsonSchema : validateJsonSchema;
  const ast = astCache[filename] ??= parseExpression(raw, {
    ranges: true,
    sourceFilename: filename,
  });

  if (!isLocaleFile)
    for (const [key, value] of Object.entries(dot.dot(data))) {
      const origin = dot.pick(`${parts.join('/')}/${key}`, source);
      if (!origin) {
        const node = findJsonNode(ast, key.split('/'), 0);
        const location = node ? `:${node.loc.start.line}:${node.loc.start.column + 1}` : '';
        warn(`${absolute}${location} ${key} entry should not exist.`);
      } else if (typeof value === 'string') {
        const node = findJsonNode(ast, key.split('/'), 0);
        const location = node ? `:${node.loc.start.line}:${node.loc.start.column + 1}` : '';

        const a_vars = extract_string_vars(value);
        const b_vars = extract_string_vars(origin);

        const missing = [];
        const added = [];

        for (const b_var of b_vars)
          if (!a_vars.has(b_var)) missing.push(b_var);

        for (const a_var of a_vars)
          if (!b_vars.has(a_var)) added.push(a_var);

        if (missing.length > 0 || added.length > 0)
          error(
            `${absolute}${location} ${key} entry has incorrect variables.` +
            (
              added.length > 0
                ? ` added: ${added.join(', ')}.`
                : ''
            ) +
            (
              missing.length > 0
                ? ` missing: ${missing.join(', ')}.`
                : ''
            )
          );
      }
    }

  if (!validator(data)) printAjvErrors(validator.errors, absolute, ast);
}

// validate schema of locale config
for (const ent of getLocaleDirents()) {
  if (ent.isFile()) {
    const localeFile = path.join(base, `${ent.name}.locale.json`);
    if (!fs.existsSync(localeFile)) continue;

    const raw = fs.readFileSync(localeFile, 'utf8');
    const ast = parseExpression(raw, {
      ranges: true,
      sourceFilename: localeFile,
    });

    if (!validateLocaleJsonSchema(require(`../${localeFile}`))) printAjvErrors(validator.errors, localeFile, ast);
  }
}

if (stats.error) {
  console.info(`\nFinished with ${stats.error} errors${stats.warn ? ` and ${stats.warn} warnings` : ''}.`)
  process.exit(1);
}

if (stats.warn) console.info(`\nFinished with ${stats.warn} warnings.`);
process.exit(0);

function extract_string_vars(string) {
  const vars = new Set();
  let vari = -1;
  let depth = -1;

  for (let i = 0; i < string.length; ++i) {
    const char = string[i];

    switch (char) {
      case '{':
        if (depth < 0)
          vari = i;
        depth += 1;
        break;

      case '}':
        if (depth < 0) break;
        depth -= 1;
        if (depth < 0)
          vars.add(string.substring(vari, 1 + i));
        break;
    }

  }

  return vars;
}