const { spawnSync } = require('node:child_process');
const { writeFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const { getLocaleDirents } = require('../util');

const base = path.resolve(__dirname, '..');
const { status, error, signal, stdout, stderr } = spawnSync('crowdin', ['list', 'translations', '--plain'], {
  cwd: base,
  encoding: 'utf8',
  timeout: 30_000,
  shell: process.platform === 'win32' ? 'pwsh' : undefined,
});

if (error || status != 0) throw error || stderr || status || signal;

const locale = new Set();
for (const str of stdout.split('\n').slice(0, -1))
  locale.add(str.split(path.sep)[0]);

for (const ent of getLocaleDirents()) {
  if (!locale.has(ent.name)) continue;

  const localeFile = `${ent.name}${ent.isFile() ? '.' : path.sep}locale.json`;
  const absolute = path.join(base, localeFile);

  let localeConfig = {};
  if (existsSync(absolute)) localeConfig = require(`../${localeFile}`);

  localeConfig.crowdin = true;
  writeFileSync(absolute, JSON.stringify(localeConfig, null, 2), 'utf8');
}