import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  placeholder: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ placeholder: 'Hello from Next.js!' })
}