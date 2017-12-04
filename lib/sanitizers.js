'use strict';

const lib = require('validator');


// Import only sanitizer functions from validator package
const SANITIZER_WHITELIST = [
  'blacklist', 'escape', 'unescape', 'normalizeEmail', 'ltrim', 'rtrim',
  'trim', 'stripLow', 'whitelist'
];
const fnNames = Object.keys(lib);
for (const fnName of fnNames) {
  if (fnName.startsWith('to') || SANITIZER_WHITELIST.includes(fnName))
    module.exports[fnName] = lib[fnName];
}
