/* eslint-env jest */
import chalk from 'chalk';
import { wrapPlugin } from '../utils/test-helpers';
import plugin from './chai-assert';

chalk.enabled = false;

const wrappedPlugin = wrapPlugin(plugin);
let consoleWarnings = [];
beforeEach(() => {
    consoleWarnings = [];
    console.warn = v => consoleWarnings.push(v);
});

function testChanged(msg, source, expectedOutput) {
    test(msg, () => {
        const result = wrappedPlugin(source);
        expect(result).toBe(expectedOutput);
        expect(consoleWarnings).toEqual([]);
    });
}

testChanged('does not change if chai is not imported',
`
// @flow
assert.equal(foo, bar, baz);
`,
`
// @flow
assert.equal(foo, bar, baz);
`
);

testChanged('does not change if assert is not imported from chai',
`
// @flow
import { should } from 'chai';
`,
`
// @flow
import { should } from 'chai';
`
);

testChanged('does not change if assert is not required from chai',
`
// @flow
const should = require('chai').should;
`,
`
// @flow
const should = require('chai').should;
`
);

const mappings = [
  ['assert.fail(foo, bar, baz);', 'expect(false).toBe(true);'], // TODO: ?
  ['assert.equal(foo, bar, baz);', 'expect(foo).toEqual(bar);'],
  ['assert.notEqual(foo, bar, baz);', 'expect(foo).not.toEqual(bar);'],
  ['assert.strictEqual(foo, bar, baz);', 'expect(foo).toBe(bar);'],
  ['assert.notStrictEqual(foo, bar, baz);', 'expect(foo).not.toBe(bar);'],
  ['assert.deepEqual(foo, bar, baz);', 'expect(foo).toEqual(bar);'],
  ['assert.notDeepEqual(foo, bar, baz);', 'expect(foo).not.toEqual(bar);'],
  ['assert.isAbove(foo, bar, baz);', 'expect(foo).toBeGreaterThan(bar);'],
  ['assert.isAtLeast(foo, bar, baz);', 'expect(foo).toBeGreaterThanOrEqual(bar);'],
  ['assert.isBelow(foo, bar, baz);', 'expect(foo).toBeLessThan(bar);'],
  ['assert.isAtMost(foo, bar, baz);', 'expect(foo).toBeLessThanOrEqual(bar);'],
  ['assert.isTrue(foo, bar, baz);', 'expect(foo).toBe(true);'],
  ['assert.isNotTrue(foo, bar, baz);', 'expect(foo).not.toBe(true);'],
  ['assert.isFalse(foo, bar, baz);', 'expect(foo).toBe(bar);'],
  ['assert.isNotFalse(foo, bar, baz);', 'expect(foo).not.toBe(bar);'],
  ['assert.isNull(foo, bar, baz);', 'expect(foo).toBeNull();'],
  ['assert.isNotNull(foo, bar, baz);', 'expect(foo).not.toBeNull();'],
  ['assert.isNaN(foo, bar, baz);', 'expect(foo).toBe();'],
  ['assert.isNotNaN(foo, bar, baz);', 'expect(foo).not.toBe();'],
  ['assert.isUndefined(foo, bar, baz);', 'expect(foo).not.toBeDefined();'],
  ['assert.isDefined(foo, bar, baz);', 'expect(foo).toBeDefined();'],
  ['assert.isFunction(foo, bar, baz);', 'expect(typeof foo).toBe(\'function\');'],
  ['assert.isNotFunction(foo, bar, baz);', 'expect(typeof foo).not.toBe(\'function\');'],
  ['assert.isObject(foo, bar, baz);', 'expect(typeof foo).toBe(\'object\');'],
  ['assert.isNotObject(foo, bar, baz);', 'expect(typeof foo).not.toBe(\'object\');'],
  ['assert.isArray(foo, bar, baz);', 'expect(Array.isArray(foo)).toBe(true);'],
  ['assert.isNotArray(foo, bar, baz);', 'expect(Array.isArray(foo)).not.toBe(true);'],
  ['assert.isString(foo, bar, baz);', 'expect(typeof foo).toBe(\'string\');'],
  ['assert.isNotString(foo, bar, baz);', 'expect(typeof foo).not.toBe(\'string\');'],
  ['assert.isNumber(foo, bar, baz);', 'expect(typeof foo).toBe(\'number\');'],
  ['assert.isNotNumber(foo, bar, baz);', 'expect(typeof foo).not.toBe(\'number\');'],
  ['assert.isBoolean(foo, bar, baz);', 'expect(typeof foo).toBe(\'boolean\');'],
  ['assert.isNotBoolean(foo, bar, baz);', 'expect(typeof foo).not.toBe(\'boolean\');'],
  ['assert.typeOf(foo, bar, baz);', 'expect(typeof foo).toBe(bar);'],
  ['assert.notTypeOf(foo, bar, baz);', 'expect(typeof foo).not.toBe(bar);'],
  ['assert.instanceOf(foo, bar, baz);', 'expect(foo).toBeInstanceOf(bar);'],
  ['assert.notInstanceOf(foo, bar, baz);', 'expect(foo).not.toBeInstanceOf(bar);'],
  ['assert.include(foo, bar, baz);', 'expect(foo).toContain(bar);'],
  ['assert.notInclude(foo, bar, baz);', 'expect(foo).not.toContain(bar);'],
  ['assert.match(foo, bar, baz);', 'expect(foo).toMatch(bar);'],
  ['assert.notMatch(foo, bar, baz);', 'expect(foo).not.toMatch(bar);'],
  ['assert.property(foo, bar, baz);', 'expect(bar in foo).toBeTruthy();'],
  ['assert.notProperty(foo, bar, baz);', 'expect(bar in foo).toBeFalsy();'],
  ['assert.propertyVal(foo, bar, baz);', 'expect(foo.bar).toBe(baz);'],
  ['assert.propertyNotVal(foo, bar, baz);', 'expect(foo.bar).not.toBe(baz);'],
  ['assert.lengthOf(foo, bar, baz);', 'expect(foo.length).toBe(bar);'],
  ['assert.throws(foo, bar, baz);', 'expect(foo).toThrow();'],
  ['assert.doesNotThrow(foo, bar, baz);', 'expect(foo).not.toThrow();'],
  ['assert.closeTo(foo, bar, baz);', 'expect(foo).toBeCloseTo(bar, baz);'],
  ['assert.approximately(foo, bar, baz);', 'expect(foo).toBeCloseTo(bar, baz);'],
  ['assert.sameMembers(foo, bar, baz);', 'expect(foo).toEqual(bar);'],
  ['assert.sameDeepMembers(foo, bar, baz);', 'expect(foo).toEqual(bar);'],
  ['assert.isExtensible(foo);', 'expect(Object.isExtensible(foo)).toBe(true);'],
  ['assert.isNotExtensible(foo);', 'expect(Object.isExtensible(foo)).not.toBe(true);'],
  ['assert.isSealed(foo);', 'expect(Object.isSealed(foo)).toBe(true);'],
  ['assert.isNotSealed(foo);', 'expect(Object.isSealed(foo)).not.toBe(true);'],
  ['assert.isFrozen(foo);', 'expect(Object.isFrozen(foo)).toBe(true);'],
  ['assert.isNotFrozen(foo);', 'expect(Object.isFrozen(foo)).not.toBe(true);'],
];

const mappingTest = mappings.reduce((test, [assert, expect]) => ({
    input: `
${test.input}
${assert}
`,
    output: `
${test.output}
${expect}
`,
}), { input: `
// @flow
import { assert } from 'chai';`,
    output: `
// @flow`,
});

testChanged('mappings', mappingTest.input, mappingTest.output);

test('not supported assertions', () => {
    const unsupportedAssertions = [
        'deepProperty',
        'notDeepProperty',
        'deepPropertyVal',
        'deepPropertyNotVal',
        'operator',
        'includeMembers',
        'includeDeepMembers',
        'changes',
        'doesNotChange',
        'increases',
        'doesNotIncrease',
        'decreases',
        'doesNotDecrease',
        'ifError',
    ];

    const fileInput = unsupportedAssertions.reduce((input, assertion) => `${input}
assert.${assertion}(foo, bar, baz);`, 'import { assert } from \'chai\';');

    wrappedPlugin(fileInput);

    expect(consoleWarnings).toEqual([
        'jest-codemods warning: (test.js) Unsupported Chai Assertion "deepProperty" found at line 2',
        'jest-codemods warning: (test.js) Unsupported Chai Assertion "notDeepProperty" found at line 3',
        'jest-codemods warning: (test.js) Unsupported Chai Assertion "deepPropertyVal" found at line 4',
        'jest-codemods warning: (test.js) Unsupported Chai Assertion "deepPropertyNotVal" found at line 5',
        'jest-codemods warning: (test.js) Unsupported Chai Assertion "operator" found at line 6',
        'jest-codemods warning: (test.js) Unsupported Chai Assertion "includeMembers" found at line 7',
        'jest-codemods warning: (test.js) Unsupported Chai Assertion "includeDeepMembers" found at line 8',
        'jest-codemods warning: (test.js) Unsupported Chai Assertion "changes" found at line 9',
        'jest-codemods warning: (test.js) Unsupported Chai Assertion "doesNotChange" found at line 10',
        'jest-codemods warning: (test.js) Unsupported Chai Assertion "increases" found at line 11',
        'jest-codemods warning: (test.js) Unsupported Chai Assertion "doesNotIncrease" found at line 12',
        'jest-codemods warning: (test.js) Unsupported Chai Assertion "decreases" found at line 13',
        'jest-codemods warning: (test.js) Unsupported Chai Assertion "doesNotDecrease" found at line 14',
        'jest-codemods warning: (test.js) Unsupported Chai Assertion "ifError" found at line 15',
    ]);
});
