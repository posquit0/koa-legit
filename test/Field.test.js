'use strict';

const Field = require('../lib/Field');


describe('Field', () => {
  describe('constructor(name, value, message)', () => {
    it('should create an instance of Field', () => {
      expect(new Field()).toBeInstanceOf(Field);
    });
  });
});
