'use strict';

/**
 * Convert requested data values to string.
 *
 * @param {*} [val] - The requested value.
 * @return {string} The converted value.
 */
module.exports.toString = (val) => {
  if (typeof val === 'string')
    return val;
  if (val == null || (isNaN(val) && !val.length))
    return '';
  return String(val);
};
