import dot from 'dot-object';
dot.keepArray = true;

import __data from './data.js';

for (const locale in __data) {
  __data[locale] = dot.dot(__data[locale], {});
  const data = __data[locale];

  for (const k in data) {
    const v = data[k];

    if (!Array.isArray(v)) {
      switch (k) {
        case 'locale.crowdin':
        case 'locale.standard':
          if (typeof v === 'boolean')
            continue
        default:
          if (typeof v === 'string')
            continue;
      }

      delete data[k];
    }

    for (let i = 0; i < v.length; ++i) {
      if (typeof v[i] !== 'string')
        continue;

      data[k + '.' + i] = v[i];
    }
  }
}

export default __data;
