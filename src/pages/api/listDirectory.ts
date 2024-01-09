import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getFilesFromDirectory } from '~/utils/api/gitAPI';
import { type DirectoryResponse } from '~/utils/api/types';
import { Option } from '~/utils/option';
import { Result } from '~/utils/result';

type ResponseData = DirectoryResponse | string;

const requestSchema = z.object({
  path: z.string(),
  owner: z.string(),
  repository: z.string(),
  branch: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const parsed = Result.fromError(() => requestSchema.parse(req.headers));

  if (parsed.isErr()) {
    res.status(400).send(parsed.unwrapErr().message);
  }

  const params = parsed.unwrap();
  const result = await getFilesFromDirectory(
    params.path,
    params.owner,
    params.repository,
    Option.fromNull(params.branch),
  );

  result.match(
    (t) => res.status(200).send(t),
    (e) => res.status(400).send(e),
  );
}
