import { Classes } from './constants'
import { createTree, type TreeNode } from './tree'

export function createFolderTree(nodes: TreeNode[]) {
  const folderTree = createTree(nodes)
  folderTree.classList.add(Classes.FOLDER_TREE)
  return folderTree
}
