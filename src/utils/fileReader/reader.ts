import { Stats, readFile, readdir, stat } from 'fs';
import { Err, Ok, type Result } from '../result';

export function nodeReadDirectory(path: string): Promise<Result<string[], string>> {
  return new Promise((resolve, _) => {
    readdir(path, (err, files) => {
      if (err) return resolve(Err(err.message));
      return resolve(Ok(files));
    });
  });
}

export function nodeReadFile(path: string): Promise<Result<string, string>> {
  return new Promise((resolve, _) => {
    readFile(path, { encoding: 'utf8' }, (err, content) => {
      if (err) return resolve(Err(err.message));
      return resolve(Ok(content));
    });
  });
}

export function fileData(path: string): Promise<Result<Stats, string>> {
  return new Promise((resolve, _) => {
    stat(path, (err, result) => {
      if (err) return resolve(Err(err.message));
      return resolve(Ok(result));
    });
  });
}
