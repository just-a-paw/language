const fs = require('node:fs');
const ignore = require('ignore').default;
const path = require('path');
const rq = require('require-all');

const gitignore = ignore();
let gitignorePath = path.join(__dirname, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  gitignore.add(fs.readFileSync(gitignorePath).toString());
}

for (const ent of fs.readdirSync(__dirname, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  if (ent.name[0] === '.') continue;
  if (gitignore.ignores(ent.name + (ent.isDirectory() ? '/' : ''))) continue;
  module.exports[ent.name] = rq({
    dirname: path.join(__dirname, ent.name),
    filter: name => {
      if (!name.endsWith('.json')) return false;
      return name.slice(0, name.length - 5);
    },
  });
}