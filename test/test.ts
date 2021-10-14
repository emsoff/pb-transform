"use strict";

const { transform } = require('../lib/');
const test = require('tape')

  test('Transform with simple key', async (t) => {
    var expect = {this : "this"}
    var result = await transform({that : 'this'}, {this : "that"})
    t.deepEqual(result, expect);
    t.end();
  });
  
  test('Transform with undefined key', async (t) => {
    var expect = {this : "this"}
    var result = await transform({that : 'this'}, {this : "that", something : undefined})
    t.deepEqual(result, expect);
    t.end();
  });