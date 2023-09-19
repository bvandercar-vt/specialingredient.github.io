import { createElement } from './html-utils'

export type TreeNode = {
  text: string
  rightText?: string
  leftIcon?: string
  className?: string
  tooltip?: string
  url?: string
  nodes?: TreeNode[]
}

function createNodes(nodes: TreeNode[]) {
  const ol = document.createElement('ol')
  for (let i = 0; i < nodes.length; i++) {
    ol.appendChild(createNode(nodes[i]))
  }
  return ol
}

function createNode({ text, tooltip, rightText, leftIcon, className, url, nodes }: TreeNode) {
  const divWrapper = document.createElement('div')
  let outerWrapper: HTMLElement = divWrapper

  if (leftIcon) {
    const leftIconEl = createElement('span', { classes: ['fa', leftIcon, 'left-icon'] })
    divWrapper.appendChild(leftIconEl)
  }

  divWrapper.appendChild(document.createTextNode(text))

  if (tooltip) {
    divWrapper.classList.add('tooltip')
    const tooltipText = createElement('span', { classes: ['tooltiptext'] })
    tooltipText.append(document.createTextNode(tooltip))
    divWrapper.appendChild(tooltipText)
  }

  if (rightText) {
    const rightSideEl = createElement('span', { classes: ['right-side'] })
    rightSideEl.appendChild(document.createTextNode(rightText))
    divWrapper.appendChild(rightSideEl)
  }

  if (url) {
    const linkWrapper = createElement('a', { attributes: { href: url, target: '_blank' } })
    linkWrapper.appendChild(divWrapper)
    outerWrapper = linkWrapper
  }

  const li = createElement('li', { classes: className ? [className] : undefined })
  li.appendChild(outerWrapper)
  if (nodes) li.appendChild(createNodes(nodes))
  return li
}

export function createTree(nodes: TreeNode[]) {
  const treeDiv = createElement('div', { classes: ['tree'] })
  treeDiv.appendChild(createNodes(nodes))
  return treeDiv
}
