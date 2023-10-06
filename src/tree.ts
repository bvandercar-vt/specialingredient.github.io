import { Classes } from './constants'
import { createElement } from './html-utils'

export type TreeNode = {
  text: string
  rightElement?: string | Node
  leftIcon?: string
  classes?: string | string[]
  tooltip?: string | Node
  url?: string
  nodes?: TreeNode[]
}

function createNodes(nodes: TreeNode[]) {
  const ol = createElement('ol', { children: nodes.map((node) => createNode(node)) })
  return ol
}

function createNode({ text, tooltip, rightElement, leftIcon, classes, url, nodes }: TreeNode) {
  const divWrapper = document.createElement('div')
  let outerWrapper: HTMLElement = divWrapper

  if (leftIcon) {
    const leftIconEl = createElement('span', { classes: ['fa', leftIcon, Classes.LEFT_ICON] })
    divWrapper.appendChild(leftIconEl)
  }

  divWrapper.appendChild(document.createTextNode(text))

  if (tooltip) {
    divWrapper.classList.add(Classes.TOOLTIP)
    const tooltipText = createElement('span', { classes: Classes.TOOLTIP_TEXT })
    tooltipText.append(tooltip)
    divWrapper.appendChild(tooltipText)
  }

  if (rightElement) {
    const rightSideEl = createElement('span', { classes: Classes.RIGHT_SIDE })
    rightSideEl.append(rightElement)
    divWrapper.appendChild(rightSideEl)
  }

  if (url) {
    const linkWrapper = createElement('a', { attributes: { href: url, target: '_blank' } })
    linkWrapper.appendChild(divWrapper)
    outerWrapper = linkWrapper
  }

  const li = createElement('li', { classes })
  li.appendChild(outerWrapper)
  if (nodes) li.appendChild(createNodes(nodes))
  return li
}

export function createTree(nodes: TreeNode[]) {
  const treeDiv = createElement('div', { classes: Classes.TREE, children: createNodes(nodes) })
  return treeDiv
}
