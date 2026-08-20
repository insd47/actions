import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

/** 고유한 임시 작업 디렉터리를 예약한다. */
export function reserve(root: string) {
  return mkdtemp(join(resolve(root), 'temp-file-'));
}

/** 임시 디렉터리 안에 raw UTF-8 content를 기록한다. */
export async function write(directory: string, requestedPath: string, content: string) {
  const path = destination(directory, requestedPath);

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, { encoding: 'utf8', flag: 'wx', mode: 0o600 });

  return path;
}

/** 임시 파일과 그 Action 전용 디렉터리를 멱등적으로 제거한다. */
export function cleanup(directory: string) {
  return rm(directory, { recursive: true, force: true });
}

/** 요청 경로가 Action 전용 임시 디렉터리를 벗어나지 않도록 해석한다. */
export function destination(directory: string, requestedPath: string) {
  if (!requestedPath || isAbsolute(requestedPath)) {
    throw new Error(`Temporary file path must be a non-empty relative path: ${requestedPath}`);
  }

  const root = resolve(directory);
  const path = resolve(root, requestedPath);
  const nested = relative(root, path);

  if (!nested || nested === '..' || nested.startsWith(`..${sep}`) || isAbsolute(nested)) {
    throw new Error(`Temporary file path must stay inside its isolated directory: ${requestedPath}`);
  }

  return path;
}
