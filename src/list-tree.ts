export type TreeNode = {
  text: string
  class?: string
  nodes?: TreeNode[]
}

function createNodes(nodes: TreeNode[]) {
  const ol = document.createElement('ol')
  for (let i = 0; i < nodes.length; i++) {
    ol.appendChild(createNode(nodes[i]))
  }
  return ol
}

function createNode(node: TreeNode) {
  const li = document.createElement('li')
  li.innerHTML = node.text
  li.className = node.class ?? ''
  if (node.nodes) li.appendChild(createNodes(node.nodes))
  return li
}

export { createNodes as createFolderTree }
