'use strict';

const debug = require('debug')('koa-legit:ContextValidator');
const Field = require('./Field');


function defaultSerializer(errors) {
  const serialized = {};
  for (const error of errors)
    serialized[error.name] = error;
  return serialized;
}

const ERRORS = Symbol();

/**
 * Koa Context Validator
 * TODO: Support cookies ctx.cookies.get()
 * TODO: Add error property like position/location/where/in
 * TODO: Support custom validator
 */
class ContextValidator {
  /**
   * Create a new ContextValidator instance.
   * TODO: Consider other options
   *
   * @param {Object} [options={}] - The options of WorkerAgent.
   */
  constructor(ctx, options = {}) {
    debug('create an instance');
    this.options = Object.assign({
      serializer: defaultSerializer
    }, options);

    if (this.options.serializer)
      this.serializer = this.options.serializer;

    if (ctx !== null && typeof ctx === 'object')
      this.ctx = ctx;
    else
      throw new TypeError('No context provided to initialize');

    this.cookies = {};

    this.fields = [];
    this[ERRORS] = null;
  }

  /**
   * Add a field to validate and sanitize.
   * Field is located in `data[path]`.
   *
   * @return {Field} The Field instance on which this method created.
   */
  check(data, path, message) {
    debug(`[check:${path}] add field to validate`);
    const value = data[path];
    const field = new Field(path, value, message);
    this.fields.push(field);
    return field;
  }

  checkParam(path, message) {
    return this.check(this.ctx.params, path, message);
  }

  checkQuery(path, message) {
    return this.check(this.ctx.query, path, message);
  }

  checkBody(path, message) {
    return this.check(this.ctx.request.body, path, message);
  }

  checkHeader(path, message) {
    return this.check(this.request.headers, path, message);
  }

  checkCookie(path, message) {
    return this.check(this.cookies, path, message);
  }

  /**
   * Validate all fields. If there is any validation failure,
   * return false.
   *
   * @return {boolean} If all fields are valid, return true.
   */
  async validate() {
    const validators = this.fields.map(async field => {
      try {
        field.validate();
      } catch (err) {
        const error = {
          name: field.name,
          value: field.value,
          message: err.message
        };
        return error;
      }
    });
    // TODO: OnlyFirst Error(Promise.race)
    const results = await Promise.all(validators);
    this[ERRORS] = results.filter(result => !!result);
    return !this[ERRORS].length;
  }

  sanitize() {
    const sanitized = {};
    for (const field of this.fields)
      sanitized[field.name] = field.sanitize();

    return sanitized;
  }

  get errors() {
    const errors = this[ERRORS] && this.serializer(this[ERRORS]);
    return errors;
  }
}

module.exports = ContextValidator;
