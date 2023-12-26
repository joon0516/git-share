import { Err, Ok, type Result } from '../result';
import { fileData, nodeReadDirectory, nodeReadFile } from './reader';
import { type Directory, type File, type FileTreeItem } from './types';

export async function readDirectory(path: string): Promise<Result<FileTreeItem[], string>> {
  const items = await nodeReadDirectory(path);
  if (items.isErr()) return Err(items.unwrapErr());

  const fileItems: FileTreeItem[] = [];

  for (const item of items.unwrap()) {
    const dirPath = `${path}/${item}`;

    const stats = await fileData(dirPath);
    if (stats.isErr()) return Err(stats.unwrapErr());

    if (stats.unwrap().isDirectory()) {
      const result = await readDirectory(dirPath);
      if (result.isErr()) return result;

      const dir: Directory = {
        name: item,
        path: dirPath,
        items: result.unwrap(),
      };
      fileItems.push(dir);
      continue;
    }

    const file = await readFile(item, dirPath);
    if (file.isErr()) return Err(file.unwrapErr());
    fileItems.push(file.unwrap());
  }

  return Ok(fileItems)
}

async function readFile(name: string, path: string): Promise<Result<File, string>> {
    const content = await nodeReadFile(path)
    if (content.isErr()) return Err(content.unwrapErr())

    return Ok({
        name,
        path,
        content: content.unwrap()
    })
}
