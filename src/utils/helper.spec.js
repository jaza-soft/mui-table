import { buildTree, flattenTree, getExpandedState } from './helper'

it('build tree', () => {
  const rows = [
    { id: 1, name: 'Field 1' },
    { id: 11, parentId: 1, name: 'Field 1.1' },
    { id: 12, parentId: 1, name: 'Field 1.2' },
    { id: 121, parentId: 12, name: 'Field 1.2.1' },
    { id: 2, name: 'Field 2' },
    { id: 21, parentId: 2, name: 'Field 2.1' },
    { id: 22, parentId: 2, name: 'Field 2.2' },
    { id: 3, name: 'Field 3' },
    { id: 31, parentId: 3, name: 'Field 3.1' },
    { id: 32, parentId: 3, name: 'Field 3.2' },
    { id: 4, name: 'Field 4' },
    { id: 41, parentId: 4, name: 'Field 4.1' },
    { id: 42, parentId: 4, name: 'Field 4.2' }
  ]

  const tree = buildTree(rows)

  expect(tree).not.toBeNull()
  expect(tree.length).toBe(4)
  expect(tree[0].level).toBe(0)
  expect(tree[0].children).not.toBeNull()
  expect(tree[0].children[0].level).toBe(1)
  expect(tree[0].children.length).toBe(2)
  expect(tree[0].children[1].children).not.toBeNull()
  expect(tree[0].children[1].children.length).toBe(1)
  expect(tree[0].children[1].children[0].level).toBe(2)

  let expanded = {
    1: false,
    2: false,
    3: false,
    4: false,
    12: false
  }

  let flatRows = flattenTree(tree, expanded)

  expect(flatRows).not.toBeNull()
  expect(flatRows.length).toBe(4)

  expanded = { ...expanded, 1: true }

  flatRows = flattenTree(tree, expanded)

  expect(flatRows).not.toBeNull()
  expect(flatRows.length).toBe(6)
  expect(flatRows[1].name).toBe('Field 1.1')

  expanded = { ...expanded, 12: true }

  flatRows = flattenTree(tree, expanded)

  expect(flatRows).not.toBeNull()
  expect(flatRows.length).toBe(7)
  expect(flatRows[3].name).toBe('Field 1.2.1')
})

it('get expanded state', () => {
  const rows = [
    { id: 1, name: 'Field 1' },
    { id: 11, parentId: 1, name: 'Field 1.1' },
    { id: 12, parentId: 1, name: 'Field 1.2' },
    { id: 121, parentId: 12, name: 'Field 1.2.1' },
    { id: 2, name: 'Field 2' },
    { id: 21, parentId: 2, name: 'Field 2.1' },
    { id: 22, parentId: 2, name: 'Field 2.2' },
    { id: 3, name: 'Field 3' },
    { id: 31, parentId: 3, name: 'Field 3.1' },
    { id: 32, parentId: 3, name: 'Field 3.2' },
    { id: 4, name: 'Field 4' },
    { id: 41, parentId: 4, name: 'Field 4.1' },
    { id: 42, parentId: 4, name: 'Field 4.2' }
  ]

  const tree = buildTree(rows)

  expect(tree).not.toBeNull()
  expect(tree.length).toBe(4)

  let defaultExpanded = true
  let expanded = getExpandedState(tree, defaultExpanded)

  expect(expanded).not.toBeNull()
  let ids = Object.keys(expanded).sort()
  expect(ids).toHaveLength(5)
  expect(ids.join('-')).toBe('1-12-2-3-4')

  defaultExpanded = (row, level) => level <= 0

  expanded = getExpandedState(tree, defaultExpanded)

  expect(expanded).not.toBeNull()
  ids = Object.keys(expanded)
    .filter((key) => expanded[key] === true)
    .sort()
  expect(ids).toHaveLength(4)
  expect(ids.join('-')).toBe('1-2-3-4')
})
