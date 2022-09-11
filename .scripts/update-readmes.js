'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const assert = require('node:assert');
const mri = require('mri');
const { locales, sourceLocale } = require('../constants');
const { getLocaleDirents } = require('../util');
const { aggregate } = require('./aggregate');
const data = Object.assign({}, require('../data'));

const crowdinLocales = new Set();
for (const locale in data) if (data[locale].locale?.crowdin) crowdinLocales.add(locale);

const base = path.resolve(__dirname, '..');
delete data[sourceLocale];

const displayNames = Object.fromEntries(locales.map(locale => [locale, new Intl.DisplayNames(locale, { type: 'language' })]));
const localeReadme = fs.readFileSync(path.join(__dirname, 'locale.README.md'), 'utf8');
const crowdinReadme = fs.readFileSync(path.join(__dirname, 'crowdin.README.md'), 'utf8');
const dirents = Object.fromEntries(getLocaleDirents().map(e => [e.name, e]));
const l10nPercent = {};

const capital = (s, l) => s.charAt(0).toLocaleUpperCase(l) + s.slice(1);

const floorCount = n => {
  if (n <= 30) {
    return 'red'
  } else if (n < 70) {
    return 'orange'
  } else if (n < 80) {
    return 'yellow'
  } else if (n < 90) {
    return 'yellowgreen'
  } else if (n < 100) {
    return 'green'
  } else {
    return 'brightgreen'
  }
}

const format = (str, info) => {
  for (const [key, value] of Object.entries(info)) {
    if (typeof value === 'undefined' || value === null) continue;
    str = str.replaceAll(`{${key}}`, value);
  }

  return str;
}

const formatReadme = locale => {
  const readme = crowdinLocales.has(locale) ? crowdinReadme : localeReadme;
  const percent = l10nPercent[locale];
  const nativeDisplayName = capital(displayNames[locale].of(locale), locale);
  const englishDisplayName = displayNames[sourceLocale].of(locale);

  return format(readme, {
    locale,
    nativeDisplayName,
    uriDisplayName: encodeURIComponent(nativeDisplayName),
    fullDisplayName: nativeDisplayName === englishDisplayName ? englishDisplayName : `${englishDisplayName} / ${nativeDisplayName}`,
    percent,
    treeOrBlob: dirents[locale].isFile() ? 'blob' : 'tree',
    extension: dirents[locale].isFile() ? '.json' : '',
    colour: percent ? floorCount(percent) : null,
  }) + `\n${aggregate(locale)}`
};

const getL10nPercent = () => {
  const { status, error, signal, stdout, stderr } = spawnSync('crowdin', ['status', 'translation', '--no-progress'], {
    cwd: base,
    encoding: 'utf8',
    shell: process.platform === 'win32' ? 'pwsh' : undefined,
  });

  if (error || status != 0) throw error || stderr || status || signal;

  for (const str of stdout.split('\n').slice(1, -1).map(s => s.trim().slice(2))) {
    if (str.length === 0) break;

    const [locale, percent] = str.split(': ');
    if (!crowdinLocales.has(locale)) continue;
    const num = +percent.slice(0, -1);
    assert(!Number.isNaN(num));
    l10nPercent[locale] = num;
  }

  assert.strictEqual(Object.keys(l10nPercent).length, crowdinLocales.size);
}

const addReadmes = info => {
  for (const locale in info) {
    const ent = dirents[locale];
    const absolute = path.join(base, locale);
    if (ent.isDirectory() && !fs.readdirSync(absolute).length)
      continue;

    const readmePath = ent.isFile() ? `${absolute}.README.md` : path.join(absolute, 'README.md');
    const editTag = `<!-- THIS FILE IS GENERATED. DO NOT EDIT -->`;
    fs.writeFileSync(readmePath, `${editTag}\n\n${info[locale]}`);
  }
};

const updateAggregate = info => {
  const aggregatePath = path.join(base, 'AGGREGATE.md');
  const formatted = Object.entries(info)
    .sort(([a], [b]) => (!l10nPercent[a] && !l10nPercent[b]) ? a.localeCompare(b) : (l10nPercent[b] ?? 0) - (l10nPercent[a] ?? 0))
    .map(([, s]) => `#${s}`)
    .join('\n\n');

  fs.writeFileSync(aggregatePath,
    fs.readFileSync(aggregatePath, 'utf8')
      .replace(
        /<!-- BLOCK AGGREGATE BEGIN -->[\s\S]+<!-- BLOCK AGGREGATE END -->/,
        `<!-- BLOCK AGGREGATE BEGIN -->\n\n<!-- THIS SECTION IS GENERATED. DO NOT EDIT -->\n\n${formatted}\n\n<!-- BLOCK AGGREGATE END -->`
      )
  );
}

const run = () => {
  const options = mri(process.argv.slice(2), {
    default: {
      aggregate: false,
    },
  });

  const allowed = new Set(options._.length ? options._ : Object.keys(data));
  const shouldUpdateAggreate = !options._.length || options.aggregatel
  const readmes = {};

  if (shouldUpdateAggreate) getL10nPercent();
  else for (const locale of allowed.values()) {
    if (crowdinLocales.has(locale)) {
      getL10nPercent();
      break;
    }
  }

  for (const locale in data) {
    if (allowed.has(locale)) readmes[locale] = formatReadme(locale);
  }

  addReadmes(readmes);

  if (shouldUpdateAggreate) {
    for (const locale in data)
      readmes[locale] ??= formatReadme(locale);
    updateAggregate(readmes)
  }
}

run();