import { type TreeNode, createTree } from './tree'

export function createFolderTree(nodes: TreeNode[]) {
  const folderTree = createTree(nodes)
  folderTree.classList.add('folder-tree')
  return folderTree
}
