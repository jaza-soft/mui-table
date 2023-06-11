import React from 'react'

import { MuiTable } from '@jazasoft/mui-table'

const columns = [
  { dataKey: 'field', title: 'Field', inputType: 'text-input' },
  { dataKey: 'calories', title: 'Calories', align: 'right', inputType: 'text-input', options: { type: 'number' } },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right', inputType: 'text-input' },
  { dataKey: 'sweet', title: 'Sweet', align: 'right', render: (value) => (!!value ? 'Yes' : 'No'), inputType: 'boolean-input' },
  { dataKey: 'carbs', title: 'Carbohydrate (g)', align: 'right', inputType: 'text-input', options: { type: 'number' } },
  { dataKey: 'protein', title: 'Protein', align: 'right', inputType: 'text-input', options: { type: 'number' } }
]

// let rows = [
//   { id: 1, serial: 1, field: 'Field 1' },
//   { id: 11, serial: 2, parentId: 1, field: 'Field 1.1' },
//   { id: 111, serial: 1, parentId: 11, field: 'Field 1.1.1' },
//   { id: 12, serial: 1, parentId: 1, field: 'Field 1.2' },
//   { id: 121, serial: 2, parentId: 12, field: 'Field 1.2.1' },
//   { id: 1211, serial: 2, parentId: 121, field: 'Field 1.2.1.1' },
//   { id: 1212, serial: 1, parentId: 121, field: 'Field 1.2.1.2' },
//   { id: 122, serial: 1, parentId: 12, field: 'Field 1.2.2' },
//   { id: 2, serial: 4, field: 'Field 2' },
//   { id: 21, serial: 2, parentId: 2, field: 'Field 2.1' },
//   { id: 22, serial: 1, parentId: 2, field: 'Field 2.2' },
//   { id: 3, serial: 2, field: 'Field 3' },
//   { id: 31, serial: 2, parentId: 3, field: 'Field 3.1' },
//   { id: 32, serial: 1, parentId: 3, field: 'Field 3.2' },
//   { id: 4, serial: 3, field: 'Field 4' },
//   { id: 41, serial: 2, parentId: 4, field: 'Field 4.1' },
//   { id: 42, serial: 1, parentId: 4, field: 'Field 4.2' }
// ].sort((a, b) => a.serial - b.serial)

let rows = [
  { id: 1, serial: 1, field: 'Field 1' },
  { id: 11, serial: 1, parentId: 1, field: 'Field 1.1' },
  { id: 12, serial: 2, parentId: 1, field: 'Field 1.2' },
  { id: 121, serial: 1, parentId: 12, field: 'Field 1.2.1' },
  { id: 122, serial: 2, parentId: 12, field: 'Field 1.2.2' },
  { id: 123, serial: 3, parentId: 12, field: 'Field 1.2.3' },
  { id: 2, serial: 4, field: 'Field 2' },
  { id: 21, serial: 2, parentId: 2, field: 'Field 2.1' },
  { id: 22, serial: 1, parentId: 2, field: 'Field 2.2' },
  { id: 3, serial: 2, field: 'Field 3' },
  { id: 31, serial: 1, parentId: 3, field: 'Field 3.1' },
  { id: 32, serial: 2, parentId: 3, field: 'Field 3.2' },
  { id: 4, serial: 3, field: 'Field 4' },
  { id: 41, serial: 1, parentId: 4, field: 'Field 4.1' },
  { id: 42, serial: 2, parentId: 4, field: 'Field 4.2' }
]

rows = rows.map((row) => ({
  ...row,
  calories: Math.round(Math.random() * 500),
  fat: Math.round(Math.random() * 10),
  carbs: Math.round(Math.random() * 100),
  sweet: Math.round(Math.random() * 10) % 2 === 0,
  protein: (Math.random() * 10).toFixed(1)
}))

const showChildAddAction = (row, rows) => {
  return row?.sweet === true;
}

const addTotalRow = (rows) => {
  let parentIdSet = new Set()
  rows.forEach((row) => parentIdSet.add(row.parentId))
  const parentIds = [...parentIdSet]

  let totalRows = []
  parentIds.forEach((parentId) => {
    const list = rows.filter((row) => row.parentId === parentId)
    let totalRow = ['calories', 'fat', 'carbs', 'protein'].reduce(
      (acc, key) => ({
        ...acc,
        [key]: list.reduce((acc, row) => acc + parseFloat(row[key]), 0)
      }),
      {}
    )
    const serial = list.length + 1
    totalRows.push({ ...totalRow, field: 'Total', totalRow: true, parentId, serial, id: parseInt(`${parentId}${serial}`) })
  })
  return [...rows, ...totalRows]
}

const TreeTable = () => {
  const onSubmit = (values, form, onSubmitComplete) => {
    const rowList = addTotalRow(values).sort((a, b) => a.serial - b.serial)
    onSubmitComplete(rowList)
  }

  const onSelect = (selectedIds) => {
    console.log({ selectedIds })
  }

  const onSelectActionClick = (event, action, rows, onActionComplete) => {
    console.log({ action, rows })
  }

  const onRowAdd = (rows, currRow) => {
    console.log({rows,currRow })
  }

  // const defaultExpanded = (row, level) => level <= 0
  // const rowList = addTotalRow(rows).sort((a, b) => a.serial - b.serial)
  return (
    <MuiTable
      columns={columns}
      rows={rows}
      editable={true}
      selectable={true}
      showEditableActions={true}
      defaultExpanded={true}
      expandedColor={['#92BFF6', '#C1DBFA', '#F0F6FE']}
      // initialExpandedState={{ 1: true, 2: true }}
      onRowAdd={onRowAdd}
      onSubmit={onSubmit}
      onSelect={onSelect}
      onSelectActionClick={onSelectActionClick}
      showChildAddAction={showChildAddAction}
    />
  )
}

export default TreeTable
