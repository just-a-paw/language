// @ts-nocheck
'use strict';

const fs = require('node:fs');
const data = require('../index');

const contributors = {};
for (const code in data) {
  const localData = data[code].locale;
  if (localData && Array.isArray(localData.contributors) && localData.contributors.length !== 0) {
    const parsed = localData.contributors
      .map(r => r?.match(/<https:\/\/github\.com\/([\w-]+)>/)?.[1])
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

${Object.keys(contributors).map(code => `/${code}/`.padEnd(spacer + 3, ' ') + contributors[code].map(r => `@${r}`).join(' '))}`,
)