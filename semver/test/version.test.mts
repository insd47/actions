import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parse } from '../src/version.ts';

describe('parse', () => {
  it('accepts a complete semantic version', () => {
    assert.deepEqual(parse('1.2.3'), {
      version: '1.2.3',
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: '',
      build: '',
    });
  });

  it('removes one lowercase v prefix', () => {
    assert.equal(parse('v1.2.3').version, '1.2.3');
  });

  it('retains prerelease and build identifiers', () => {
    assert.deepEqual(parse('v2.3.4-beta.1+build.42'), {
      version: '2.3.4-beta.1+build.42',
      major: 2,
      minor: 3,
      patch: 4,
      prerelease: 'beta.1',
      build: 'build.42',
    });
  });

  for (const value of [
    '1',
    '1.2',
    'V1.2.3',
    'vv1.2.3',
    '=1.2.3',
    ' 1.2.3',
    '1.2.3 ',
    '01.2.3',
    '1.2.3-alpha.01',
    'refs/tags/v1.2.3',
  ]) {
    it(`rejects ${JSON.stringify(value)}`, () => {
      assert.throws(() => parse(value), /Invalid semantic version/);
    });
  }
});
