import * as core from '@actions/core';
import { tmpdir } from 'node:os';
import * as file from './file.js';

async function run() {
  const requestedPath = core.getInput('path', { required: true });
  const content = core.getInput('content', { required: true, trimWhitespace: false });
  const root = process.env.RUNNER_TEMP ?? tmpdir();
  const directory = await file.reserve(root);

  core.saveState('directory', directory);

  const path = await file.write(directory, requestedPath, content);

  core.setOutput('path', path);
  core.info(`Created temporary file '${path}'.`);
}

run().catch((error: unknown) => {
  core.setFailed(error instanceof Error ? error.message : String(error));
});
