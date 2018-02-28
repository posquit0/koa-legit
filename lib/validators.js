'use strict';

const lib = require('validator');


// Import only validator functions from validator package
const VALIDATOR_WHITELIST = ['contains', 'equals', 'matches'];
const fnNames = Object.keys(lib);
for (const fnName of fnNames) {
  if (fnName.startsWith('is') || VALIDATOR_WHITELIST.includes(fnName))
    module.exports[fnName] = lib[fnName];
}

/**
 * Check value is given. This means the value may not be undefined.
 *
 * @return {boolean} If value is not undefined, return true.
 */
// module.exports.exists = function exists(value) {
//   return typeof value !== 'undefined';
// };
