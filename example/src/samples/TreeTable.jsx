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

let rows = [
  { id: 1, serial: 1, field: 'Field 1' },
  { id: 11, serial: 2, parentId: 1, field: 'Field 1.1' },
  { id: 12, serial: 1, parentId: 1, field: 'Field 1.2' },
  { id: 121, serial: 2, parentId: 12, field: 'Field 1.2.1' },
  { id: 1211, serial: 2, parentId: 121, field: 'Field 1.2.1.1' },
  { id: 1212, serial: 1, parentId: 121, field: 'Field 1.2.1.2' },
  { id: 122, serial: 1, parentId: 12, field: 'Field 1.2.2' },
  { id: 2, serial: 4, field: 'Field 2' },
  { id: 21, serial: 2, parentId: 2, field: 'Field 2.1' },
  { id: 22, serial: 1, parentId: 2, field: 'Field 2.2' },
  { id: 3, serial: 2, field: 'Field 3' },
  { id: 31, serial: 2, parentId: 3, field: 'Field 3.1' },
  { id: 32, serial: 1, parentId: 3, field: 'Field 3.2' },
  { id: 4, serial: 3, field: 'Field 4' },
  { id: 41, serial: 2, parentId: 4, field: 'Field 4.1' },
  { id: 42, serial: 1, parentId: 4, field: 'Field 4.2' }
].sort((a, b) => a.serial - b.serial)
rows = rows.map((row) => ({
  ...row,
  calories: Math.round(Math.random() * 500),
  fat: Math.round(Math.random() * 10),
  carbs: Math.round(Math.random() * 100),
  sweet: Math.round(Math.random() * 10) % 2 === 0,
  protein: (Math.random() * 10).toFixed(1)
}))

const TreeTable = () => {
  const onSubmit = (values, form, onSubmitComplete) => {
    console.log(values)
    onSubmitComplete(values)
  }

  // const defaultExpanded = (row, level) => level <= 0

  return (
    <MuiTable
      columns={columns}
      rows={rows}
      editable={true}
      showEditableActions={true}
      defaultExpanded={true}
      expandedColor='rgba(101, 129, 157, 0.1)'
      // initialExpandedState={{ 1: true, 2: true }}
      onSubmit={onSubmit}
    />
  )
}

export default TreeTable
