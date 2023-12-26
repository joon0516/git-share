export interface File {
    name: string
    path: string
    content: string
}

export interface Directory {
    name: string
    path: string
    items: FileTreeItem[]
}

export type FileTreeItem = File | Directory