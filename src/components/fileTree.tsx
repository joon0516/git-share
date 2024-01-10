import { type DirectoryResponse } from '~/utils/api/types';
import { Err, Ok, type Result } from '~/utils/result';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons';
import { type Option } from '~/utils/option';
import { useQuery } from '@tanstack/react-query';
import { assert } from '~/utils/contract';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './shadcn/table';

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//! MAIN COMPONENT
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

interface FileTreeProps {
  path: string;
  repository: string;
  owner: string;
  branch: Option<string>;
  width: string;
  height: string;
  onItemSelected: (itemPath: string) => void;
}

function FileTree(props: FileTreeProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  function setSelection(selection: string) {
    setSelectedItem(selection);
    props.onItemSelected(selection);
  }

  const { data, status } = useQuery({
    queryKey: ['filetree'],
    queryFn: async () => fetchDirectory(props),
  });

  if (status == 'pending') return <p> loading... </p>;
  if (status == 'error') return <p> error... </p>;
  if (data.isErr()) return <p> There was an error... {data.unwrapErr()} </p>;

  return (
    <Table className='rounded-sm border-separate'>
      <TableHeader>
        <TableRow>
          <TableHead className="h-[50px]r w-[100px] bg-slate-800 text-center text-slate-300">
            Files
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.unwrap().map((e) => (
          <TableRow key={e.path} className='border-t-0'>
            <TableCell
              onClick={(_) => setSelection(e.path)}
              className={tableColumnStyles(e.path, selectedItem)}
            >
              {responseItemToLabelIcon({ item: e })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default FileTree;

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//! FALLBACKS
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

function loadingFallback() {
  return <p> loading... </p>;
}

function errorFallback() {
  <p> error... </p>;
}
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
//! HELPERS
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

interface IconProps {
  item: DirectoryResponse[number];
}

function responseItemToLabelIcon(props: IconProps) {
  return (
    <div className="font-outfit flex h-[100%] select-none flex-row items-center gap-3 rounded-md p-3 text-sm text-slate-400">
      <FontAwesomeIcon icon={props.item.type == 'file' ? faFile : faFolder} />
      {props.item.name}
    </div>
  );
}

function tableColumnStyles(currentItem: string, selectedItem: string | null): string {
  const isSelected = currentItem == selectedItem;
  if (isSelected)
    return 'h-[100%] border-[0.5px] border-slate-600 p-0 brightness-[0.55] bg-slate-900 border-t-0';
  return 'border-[0.5px] border-slate-600 p-0 hover:brightness-75 bg-slate-900 border-t-0';
}

async function fetchDirectory(options: FileTreeProps): Promise<Result<DirectoryResponse, string>> {
  const headers = new Headers();
  headers.append('path', options.path);
  headers.append('owner', options.owner);
  headers.append('repository', options.repository);
  options.branch.map((b) => headers.append('branch', b));

  const res = await fetch('api/listDirectory', { headers });

  if (res.status == 200) {
    const json = (await res.json()) as DirectoryResponse;
    return Ok(json);
  }

  assert(res.status == 400);
  alert(await res.text());
  return Err(await res.text());
}
