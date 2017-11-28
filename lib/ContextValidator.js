'use strict';

const debug = require('debug')('koa-legit:ContextValidator');
const Field = require('./Field');


// validate
// values
// optional
// ctx.cookies.get()

function defaultSerializer(errors) {
  const serialized = {};
  for (const error of errors)
    serialized[error.name] = error;
  return serialized;
}
/**
 * Koa Context Validator
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

    if (typeof ctx !== 'object')
      throw new TypeError('No context provided to initialize');

    this.ctx = ctx;
    this.params = ctx.params;
    this.query = ctx.query;
    this.body = ctx.request.body;
    this.headers = ctx.request.headers;
    // TODO: Support Cookies
    this.cookies = {};
    this.validators = [];
    this.fields = [];
    this.errors = null;
  }

  check(data, path, message) {
    const value = data[path];
    const field = new Field(value, message);
    const validator = async () => {
      try {
        field.validate();
      } catch (err) {
        // TODO: position / location / place / where / in: param || query || body || cookie || header
        const error = {
          name: path,
          value: value,
          message: err.message
        };
        return error;
      }
    };
    this.validators.push(validator);
    return field;
  }

  checkParam(path, message) {
    return this.check(this.params, path, message);
  }

  checkQuery(path, message) {
    return this.check(this.query, path, message);
  }

  checkBody(path, message) {
    return this.check(this.body, path, message);
  }

  checkHeader(path, message) {
    return this.check(this.headers, path, message);
  }

  checkCookie(path, message) {
    return this.check(this.cookies, path, message);
  }

  async run() {
    const validators = this.validators.map(fn => fn());
    // TODO: OnlyFirst Error(Promise.race)
    const results = await Promise.all(validators);
    this.errors = results.filter(result => !!result);
  }

  getErrors() {
    const errors = this.errors && this.serializer(this.errors);
    return errors;
  }
}

module.exports = ContextValidator;
