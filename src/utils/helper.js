export const getDistinctValues = (values) => {
  if (!values) return values
  if (!Array.isArray(values)) return values
  const set = new Set()
  values.forEach((value) => set.add(value))
  return Array.from(set)
}

export const multiLineText = (text, length) => {
  if (!text) return [text]
  const result = []
  if (text) {
    while (text.length > length) {
      let idx = text.substring(0, length).lastIndexOf(' ')
      if (idx === -1) {
        idx = text.indexOf(' ')
        if (idx === -1) break
      }
      result.push(text.substring(0, idx))
      text = text.substring(idx + 1)
    }
    result.push(text)
  }
  return result
}

export const capitalize = (text) => {
  if (typeof text === 'string' && text.trim().length > 0) {
    text = text.trim()
    text = text.charAt(0).toUpperCase() + text.substring(1)
  }
  return text
}

export const buildTree = (rows, idKey = 'id', parentIdKey = 'parentId') => {
  const rootRows = rows.filter((row) => row[parentIdKey] === null || row[parentIdKey] === undefined)
  const tree = rootRows.map((root) => createChild(root, rows, 0, idKey, parentIdKey))
  return tree
}

export const flattenTree = (tree, expanded = {}, idKey = 'id') => {
  return tree.flatMap((row) => flattenChild(row, expanded, idKey))
}

export const getExpandedState = (tree, defaultExpanded, idKey = 'id') => {
  let expanded = {}
  tree.forEach((root) => expandedChild(root, expanded, defaultExpanded, idKey))
  return expanded
}

const expandedChild = (root, expanded, defaultExpanded, idKey) => {
  if (root?.children?.length > 0) {
    expanded[root[idKey]] = typeof defaultExpanded === 'function' ? defaultExpanded(root, root?.level) : !!defaultExpanded
    root.children.forEach((child) => expandedChild(child, expanded, defaultExpanded, idKey))
  }
}

const flattenChild = (root, expanded = {}, idKey) => {
  if (!root.children || root.children.length === 0 || !expanded[root[idKey]]) {
    return [root]
  } else {
    return [root, ...root.children.flatMap((child) => flattenChild(child, expanded, idKey))]
  }
}

const createChild = (root, rows, level, idKey, parentIdKey) => {
  const children = rows.filter((row) => row[parentIdKey] === root[idKey])
  return {
    ...root,
    level,
    children: children.map((child) => createChild(child, rows, level + 1, idKey, parentIdKey))
  }
}
