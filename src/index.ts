import * as core from '@actions/core';
import { parse } from './version.js';

function run() {
  const result = parse(core.getInput('version', { required: true }));

  core.setOutput('version', result.version);
  core.setOutput('major', result.major);
  core.setOutput('minor', result.minor);
  core.setOutput('patch', result.patch);
  core.setOutput('prerelease', result.prerelease);
  core.setOutput('build', result.build);
  core.setOutput('is-prerelease', result.prerelease !== '');
  core.info(`Resolved semantic version ${result.version}.`);
}

try {
  run();
} catch (error) {
  core.setFailed(error instanceof Error ? error.message : String(error));
}
