// @ts-nocheck
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { getLocaleDirents } = require('../util');

const contributors = {};
for (const ent of getLocaleDirents()) {
  const code = ent.name;
  const file = `${code}${ent.isFile() ? '.' : '/'}locale.json`;
  if (!fs.existsSync(path.join(path.resolve(__dirname, '..'), file))) continue;
  const data = require(`../${file}`);
  if (data && Array.isArray(data.contributors) && data.contributors.length !== 0) {
    const parsed = data.contributors
      .map(r => r?.github?.match(/^https:\/\/github\.com\/([\w-]+)$/)?.[1])
      .filter(r => typeof r === 'string')
      .sort((a, b) => a.normalize().localeCompare(b.normalize()));
    if (parsed.length !== 0) contributors[code] = parsed;
  }
}

const spacer = Math.max(...Object.keys(contributors).map(r => r.length));
fs.writeFileSync(
  './.github/CODEOWNERS',
  `# This file is generated.
# Add yourself to the "locale.contributors" array instead.

${Object.keys(contributors).map(code => `/${code}/`.padEnd(spacer + 3) + contributors[code].map(r => `@${r}`).join(' ')).join('\n')}`,
)