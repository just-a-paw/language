const fs = require('node:fs');
const path = require('node:path');

const base = path.resolve(__dirname);

/**
 * @typedef LocaleCode
 * @type {string}
 */

/**
 * @typedef LocaleDirent
 * @type {import('fs').Dirent & { name: LocaleCode }}
 */

/**
 * Loosely check if this is a potential IEFT BCP 47 code without script
 * @param {string} code 
 * @returns {boolean}
 */
exports.isCode = code => /^[a-z]{2,3}(-[A-Za-z0-9]{2,})?$/.test(code);

/**
 * Check whether this code and its subtags exist, excluding script.
 * @param {string} code
 * @returns {boolean}
 */
exports.isLocale = code => {
  const { supplemental: { languageData } } = require('cldr-data/supplemental/languageData.json');
  const subtags = code.split('-');
  const [language, territory /*, script*/] = subtags;
  switch (subtags.length) {
    case 1: return language in languageData;
    case 2: return languageData[language]?._territories?.includes(territory);
    /* case 3: return false; // script tag is not allowed */
    default: return false;
  }
}

/**
 * @returns {LocaleDirent[]}
 */
exports.getLocaleDirents = () => fs.readdirSync(base, { withFileTypes: true })
  .filter(e =>
    e.isDirectory() ?
      exports.isCode(e.name) :
      e.isFile() && e.name.endsWith('.json') && exports.isCode(e.name = e.name.slice(0, -5))
  )

/**
 * @param {Iterable<LocaleCode>} locales 
 * @return {IterableIterator<string>}
 */
exports.getLocaleFiles = function* (locales) {
  const set = new Set(locales);

  for (const ent of exports.getLocaleDirents()) {
    if (!set.has(ent.name)) continue;
    if (ent.isFile()) ent.name += '.json';
    for (const file of exports.traverseDirectory(base, ent.name, ent))
      if (file.endsWith('.json')) yield file.slice(0, -5);
  }
}

/**
 * Traverses the directory and yields the relative location of each file.
 * @param {string} base
 * @param {string} rel
 * @param {import('fs').Dirent} ent
 * @return {IterableIterator<string>}
 */
exports.traverseDirectory = function* (base, rel, ent) {
  if (ent.isDirectory())
    for (const ent2 of fs.readdirSync(path.join(base, rel), { withFileTypes: true }))
      for (const str of exports.traverseDirectory(base, path.join(rel, ent2.name), ent2))
        yield str;
  else if (ent.isFile())
    yield rel;
}

/**
 * @param {import('@babel/parser').ParseResult<import('@babel/types').Expression>} node 
 * @param {string[]} name 
 * @param {number} index 
 * @returns {import('@babel/types').Expression?}
 */
exports.findJsonNode = (node, name, index) => {
  switch (node.type) {
    case 'ObjectExpression':
      for (const property of node.properties) {
        if (property.key.value === name[index]) {
          if (++index === name.length) return property;
          return exports.findJsonNode(property.value, name, index);
        }
      }

      break;
    case 'ArrayExpression': {
      const element = node.elements[name[index]];
      if (element) {
        if (++index === name.length) return element;
        return exports.findJsonNode(element.value, name, index);
      }

      break;
    }
  }
}

/**
 * Creates a two-level shallow copy of obj without any 'locale' prop on the second level
 * @template T
 * @param {T} obj 
 * @returns {{[P in keyof T]: Omit<T[P], 'locale'>}[keyof T]}
 */
exports.removeConfigProperties = obj => {
  const obj_ = {};

  for (const locale in obj) {
    obj_[locale] = {};
    for (const prop in obj[locale]) {
      if (prop !== 'locale') obj_[locale][prop] = obj[locale][prop]
    }
  }

  return obj_;
}