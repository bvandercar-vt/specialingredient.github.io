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
    const leftIconEl = document.createElement('span')
    leftIconEl.classList.add('fa', leftIcon)
    leftIconEl.style.marginRight = '0.5em'
    divWrapper.appendChild(leftIconEl)
  }

  divWrapper.appendChild(document.createTextNode(text))

  if (tooltip) {
    divWrapper.classList.add('tooltip')
    const tooltipText = document.createElement('span')
    tooltipText.classList.add('tooltiptext')
    tooltipText.append(document.createTextNode(tooltip))
    divWrapper.appendChild(tooltipText)
  }

  if (rightText) {
    const rightSideEl = document.createElement('span')
    rightSideEl.classList.add('right-side')
    rightSideEl.appendChild(document.createTextNode(rightText))
    divWrapper.appendChild(rightSideEl)
  }

  if (url) {
    const linkWrapper = document.createElement('a')
    linkWrapper.setAttribute('href', url)
    linkWrapper.setAttribute('target', '_blank')
    linkWrapper.appendChild(divWrapper)
    outerWrapper = linkWrapper
  }

  const li = document.createElement('li')
  li.appendChild(outerWrapper)
  li.className = className ?? ''
  if (nodes) li.appendChild(createNodes(nodes))
  return li
}

export function createTree(nodes: TreeNode[]) {
  const treeDiv = document.createElement('div')
  treeDiv.className = 'tree'
  treeDiv.appendChild(createNodes(nodes))
  return treeDiv
}
