import classNames from 'classnames'
import { Tree, TreeNode } from './Tree'

export const FolderTree = ({ nodes, className }: { nodes: TreeNode[]; className: string }) => (
  <Tree className={classNames('folder-tree', className)} nodes={nodes} />
)
