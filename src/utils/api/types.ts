import { type Prettify } from '~/utils/utilityTypes';

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//! DESCRIPTOR TYPES
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

export interface FileDescriptor {
  type: 'file';
  name: string;
  path: string;
}

export interface DirectoryDescriptor {
  type: 'directory';
  name: string;
  path: string;
}

export type TreeItemDescriptor = FileDescriptor | DirectoryDescriptor;

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//! DIRECTORY RESPONSE
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

/* https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28 */
interface DirectoryResponseItem {
  type: string;
  size: number;
  name: string;
  path: string;
  sha: string;
  git_url: string;
  download_url: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

type DirectoryResponse_ = DirectoryResponseItem & {
  entries: DirectoryResponseItem[];
};
export type DirectoryResponse = Prettify<DirectoryResponse_>;

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//! FILE RESPONSE
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

/* https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28 */
export interface FileResponse {
  type: string;
  encoding: string;
  size: number;
  name: string;
  path: string;
  content: Blob;
  sha: string;
  url: string;
  git_url: string;
  html_url: string;
  download_url: string;
  _links: {
    git: string;
    self: string;
    html: string;
  };
}
