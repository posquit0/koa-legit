'use strict';

const debug = require('debug')('koa-legit');
const ContextValidator = require('./ContextValidator');


/**
 * Return middleware that provide the validation and
 * sanitization functions to context.
 *
 * @param {Object} [options={}] - The middleware options.
 * @return {function} Koa middleware.
 */
function legit(options = {}) {
  debug('create a legit middleware');
  const {} = options;

  return async (ctx, next) => {
    ctx.validator = new ContextValidator(ctx);
    await next();
  };
}

module.exports = legit;
