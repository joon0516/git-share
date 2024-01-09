import { type ZodError } from 'zod';
import { Err, Result } from '~/utils/result';
import { None, type Option } from '../option';
import { Ok } from '../result';
import {
  directoryResponseSchema,
  fileResponseSchema,
  type DirectoryResponse,
  type FileResponse,
} from './types';

export async function getFilesFromDirectory(
  path: string,
  owner: string,
  repository: string,
  branch: Option<string> = None(),
): Promise<Result<DirectoryResponse, string>> {
  const url = `https://api.github.com/repos/${owner}/${repository}/contents/${path}`;
  const query = branch.map((s) => `?ref=${s}`).unwrapOrDefault('');
  const headers = new Headers({
    Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
    Accept: 'application/vnd.github+json',
  });

  const response = await Result.fromErrorAsync(
    fetch(url + query, {
      method: 'GET',
      headers,
    }),
  );

  if (response.isErr()) return Err(response.unwrapErr().message);

  const json = await Result.fromErrorAsync(response.unwrap().json());
  if (json.isErr()) return Err(json.unwrapErr().message);

  if (!response.unwrap().ok) return Err(`Git request failed:: ${JSON.stringify(json.unwrap())}`);

  const parsed = Result.fromError(() => directoryResponseSchema.parse(json.unwrap()));
  if (parsed.isErr()) {
    const error = parsed.unwrapErr() as ZodError<FileResponse>;
    const formatted = error.format();
    console.error(formatted, error)

    if (formatted.type?._errors)
      return Err('This API route is for directories, but you provided a file path');
    return Err(`Zod parsing failed`);
  }

  return Ok(parsed.unwrap());
}

export async function readFile(
  path: string,
  owner: string,
  repository: string,
  branch: Option<string> = None(),
): Promise<Result<FileResponse, string>> {
  const url = `https://api.github.com/repos/${owner}/${repository}/contents/${path}`;
  const query = branch.map((s) => `?ref=${s}`).unwrapOrDefault('');
  const headers = new Headers({
    Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
    Accept: 'application/vnd.github+json',
  });

  const response = await Result.fromErrorAsync(
    fetch(url + query, {
      method: 'GET',
      headers,
    }),
  );

  if (response.isErr()) return Err(response.unwrapErr().message);

  const json = await Result.fromErrorAsync(response.unwrap().json());
  if (json.isErr()) return Err(json.unwrapErr().message);

  if (!response.unwrap().ok) return Err(`Git request failed:: ${JSON.stringify(json.unwrap())}`);

  const parsed = Result.fromException(() => fileResponseSchema.parse(json.unwrap()));
  if (parsed.isErr()) {
    const error = parsed.unwrapErr() as ZodError<FileResponse>;
    const formatted = error.format();

    if (formatted.type?._errors)
      return Err('This API route is for files, but you provided a directory path');
    return Err(`Zod parsing failed. Got ${JSON.stringify(response.unwrap())}`);
  }

  return Ok(parsed.unwrap());
}
