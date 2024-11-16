import classNames from 'classnames'
import { Tree, type TreeProps } from './Tree'

export const FolderTree = ({ nodes, className }: TreeProps) => (
  <Tree className={classNames('folder-tree', className)} nodes={nodes} />
)
