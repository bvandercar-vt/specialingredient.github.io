import classNames from 'classnames'

export type TreeNode = {
  text: string
  rightElement?: string | React.ReactNode
  leftIcon?: string
  classes?: string | string[]
  tooltip?: string | React.ReactNode
  url?: string
  nodes?: TreeNode[]
}

const NodeList = ({ nodes }: { nodes: TreeNode[] }) => (
  <ol>
    {nodes.map((node) => (
      <Node {...node} />
    ))}
  </ol>
)

const Node = ({ text, tooltip, rightElement, leftIcon, classes, url, nodes }: TreeNode) => {
  let contents = (
    <div className={classNames('tree-row', { tooltip: Boolean(tooltip) })}>
      {leftIcon && <span className={classNames(['fa', leftIcon, 'left-icon'])} />}
      {text}
      {tooltip && <span className="tooltiptext">{tooltip}</span>}
      {rightElement && <span className="right-side">{rightElement}</span>}
    </div>
  )

  if (url) {
    contents = (
      <a href={url} target="_blank">
        {contents}
      </a>
    )
  }

  return (
    <li className={classNames(classes)}>
      {contents}
      {nodes && <NodeList nodes={nodes} />}
    </li>
  )
}

export const Tree = ({ nodes, className }: { nodes: TreeNode[]; className: string }) => (
  <div className={classNames('tree', className)}>{<NodeList nodes={nodes} />}</div>
)
