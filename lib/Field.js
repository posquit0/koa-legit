'use strict';

const debug = require('debug')('koa-legit:Field');
const lib = require('validator');


const EXTRA_VALIDATORS = ['contains', 'equals', 'matches'];
const EXTRA_SANITIZERS = [
  'blacklist', 'escape', 'unescape', 'normalizeEmail', 'ltrim', 'rtrim',
  'trim', 'stripLow', 'whitelist'
];
const validatorLib = Object.keys(lib)
  .filter(fnName => {
    return fnName.startsWith('is') || EXTRA_VALIDATORS.includes(fnName);
  });
const sanitizerLib = Object.keys(lib)
  .filter(fnName => {
    return fnName.startsWith('to') || EXTRA_SANITIZERS.includes(fnName);
  });


function custom(x, fn) {
  return fn(x);
}

/**
 * Field
 */
class Field {
  /**
   * Create a new Field instance.
   *
   * @param {string} value - The data value of the field as string.
   * @param {string} [message=null] - The default message of the field validation.
   */
  constructor(value, message = null) {
    debug('create an instance');
    this.value = value;
    this.message = message;
    this.validators = [];
    this.sanitizers = [];

    // TODO: Pre-define before constructor
    for (const fnName of validatorLib) {
      const fn = lib[fnName];
      Field.prototype[fnName] = (params = [], options = {}) => {
        if (typeof params === 'string')
          options = { message: params };
        else if (!Array.isArray(params))
          options = params || {};
        else if (typeof options === 'string')
          options = { message: options };

        params = Array.isArray(params) ? params : [];
        const {
          message = null, negated = false, optional = false
        } = options;

        const validator = x => {
          const checkOptional = optional && typeof x === 'undefined';
          if (!checkOptional && fn(x, ...params) === negated)
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

  /**
   * Validate the field data with all registered validation rules.
   *
   * @throws {Error} If one of validation rules failed.
   */
  validate() {
    debug(`[validate] apply ${this.validators.length} validators`);
    for (const validator of this.validators)
      validator(this.value);
  }


  /**
   * Sanitize the field data with all registered sanitization functions.
   *
   * @return {*} The sanitized value.
   */
  sanitize() {
    debug(`[sanitize] apply ${this.sanitizers.length} sanitizers`);
    let value = this.value;
    for (const sanitizer of this.sanitizers)
      value = sanitizer(value);
    return value;
  }
}

module.exports = Field;
