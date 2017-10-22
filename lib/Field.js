'use strict';

const lib = require('validator');


const EXTRA_VALIDATORS = ['contains', 'equals', 'matches'];
const EXTRA_SANITIZERS = [
  'blacklist', 'escape', 'unescape', 'normalizeEmail', 'ltrim', 'rtrim',
  'trim', 'stripLow', 'whitelist'
];
const filterValidators = fnName => (
  fnName.startsWith('is') || EXTRA_VALIDATORS.includes(fnName)
);
const filterSanitizers = fnName => (
  fnName.startsWith('to') || EXTRA_SANITIZERS.includes(fnName)
);

class Field {
  constructor(val, message = null) {
    this.val = val;
    this.message = message;
    this.validators = [];
    this.sanitizers = [];

    // TODO: Pre-define before constructor
    const validatorLib = Object.keys(lib).filter(filterValidators);
    const sanitizerLib = Object.keys(lib).filter(filterSanitizers);

    for (const fnName of validatorLib) {
      const fn = lib[fnName];
      Field.prototype[fnName] = (params = [], options = {}) => {
        if (typeof(params) === 'string')
          options = { message: params };
        else if (!Array.isArray(params))
          options = params || {};
        else if (typeof(options) === 'string')
          options = { message: options };

        params = Array.isArray(params) ? params : [];
        const { message = null, negated = false } = options;

        const validator = x => {
          if (fn(x, ...params) === negated)
            throw new Error(message || this.message);
        };
        this.validators.push(validator);
        return this;
      };
    }

    for (const fnName of sanitizerLib) {
      const fn = lib[fnName];
      Field.prototype[fnName] = (params = []) => {
        const sanitizer = x => fn(x, ...params);
        this.sanitizers.push(sanitizer);
        return this;
      };
    }
  }

  validate() {
    for (const validator of this.validators)
      validator(this.val);
  }

  sanitize() {
    let val = this.val;
    for (const sanitizer of this.sanitizers)
      val = sanitizer(val);
    return val;
  }
}

module.exports = Field;
