import * as core from '@actions/core';
import * as file from '../file.js';

async function run() {
  const directory = core.getState('directory');

  if (!directory) {
    core.info('No temporary file directory to remove.');
    return;
  }

  await file.cleanup(directory);
  core.info(`Removed temporary file directory '${directory}'.`);
}

run().catch((error: unknown) => {
  core.warning(error instanceof Error ? error.message : String(error));
});
