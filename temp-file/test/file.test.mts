import assert from 'node:assert/strict';
import { access, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { cleanup, destination, reserve, write } from '../src/file.ts';

describe('temporary file', () => {
  it('writes exact multiline content inside an isolated directory', async (context) => {
    const directory = await reserve(tmpdir());
    context.after(() => cleanup(directory));

    const path = await write(directory, 'nested/example.json', '{\n  "한글": true\n}\n');

    assert.equal(path, join(directory, 'nested/example.json'));
    assert.equal(await readFile(path, 'utf8'), '{\n  "한글": true\n}\n');

    if (process.platform !== 'win32') {
      assert.equal((await stat(path)).mode & 0o777, 0o600);
    }
  });

  it('does not overwrite an existing file', async (context) => {
    const directory = await reserve(tmpdir());
    context.after(() => cleanup(directory));

    const path = await write(directory, 'value.txt', 'original');

    await assert.rejects(() => write(directory, 'value.txt', 'replacement'), /EEXIST/);
    assert.equal(await readFile(path, 'utf8'), 'original');
  });

  it('rejects empty, absolute, and escaping paths', async (context) => {
    const directory = await reserve(tmpdir());
    context.after(() => cleanup(directory));

    assert.throws(() => destination(directory, ''), /non-empty relative path/);
    assert.throws(() => destination(directory, resolve(directory, 'absolute.txt')), /non-empty relative path/);
    assert.throws(() => destination(directory, '../outside.txt'), /stay inside/);
  });

  it('removes its isolated directory idempotently', async () => {
    const directory = await reserve(tmpdir());
    await write(directory, 'nested/value.txt', 'value');

    await cleanup(directory);
    await cleanup(directory);

    await assert.rejects(() => access(directory));
  });
});
