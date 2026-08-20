import { parse as parseSemVer } from 'semver';

/** 선택적 v 접두사를 허용하고 엄격한 SemVer 값을 반환한다. */
export function parse(value: string): Version {
  const source = value.startsWith('v') ? value.slice(1) : value;
  const parsed = parseSemVer(source);

  if (!parsed) {
    throw new Error(`Invalid semantic version: ${value}`);
  }

  const prerelease = parsed.prerelease.join('.');
  const build = parsed.build.join('.');
  let version = `${parsed.major}.${parsed.minor}.${parsed.patch}`;

  if (prerelease) version += `-${prerelease}`;
  if (build) version += `+${build}`;

  if (source !== version) {
    throw new Error(`Invalid semantic version: ${value}`);
  }

  return {
    version,
    major: parsed.major,
    minor: parsed.minor,
    patch: parsed.patch,
    prerelease,
    build,
  };
}

interface Version {
  version: string;
  major: number;
  minor: number;
  patch: number;
  prerelease: string;
  build: string;
}
