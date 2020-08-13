import React from 'react'

import { MuiTable } from '@jazasoft/mui-table'

const columns = [
  { dataKey: 'field', title: 'Field' },
  { dataKey: 'calories', title: 'Calories', align: 'right' },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right' },
  { dataKey: 'sweet', title: 'Sweet', align: 'right', render: (value) => (!!value ? 'Yes' : 'No') },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right' },
  { dataKey: 'carbs', title: 'Carbohydrate (g)', align: 'right' },
  { dataKey: 'protein', title: 'Protein', align: 'right' }
]

let rows = [
  { id: 1, field: 'Field 1' },
  { id: 11, parentId: 1, field: 'Field 1.1' },
  { id: 12, parentId: 1, field: 'Field 1.2' },
  { id: 121, parentId: 12, field: 'Field 1.2.1' },
  { id: 1211, parentId: 121, field: 'Field 1.2.1.1' },
  { id: 1212, parentId: 121, field: 'Field 1.2.1.2' },
  { id: 122, parentId: 12, field: 'Field 1.2.2' },
  { id: 2, field: 'Field 2' },
  { id: 21, parentId: 2, field: 'Field 2.1' },
  { id: 22, parentId: 2, field: 'Field 2.2' },
  { id: 3, field: 'Field 3' },
  { id: 31, parentId: 3, field: 'Field 3.1' },
  { id: 32, parentId: 3, field: 'Field 3.2' },
  { id: 4, field: 'Field 4' },
  { id: 41, parentId: 4, field: 'Field 4.1' },
  { id: 42, parentId: 4, field: 'Field 4.2' }
]
rows = rows.map((row) => ({
  ...row,
  calories: Math.round(Math.random() * 500),
  fat: Math.round(Math.random() * 10),
  carbs: Math.round(Math.random() * 100),
  sweet: Math.round(Math.random() * 10) % 2 === 0,
  protein: (Math.random() * 10).toFixed(1)
}))

const TreeTable = () => {
  // const defaultExpanded = (row, level) => level <= 0
  return (
    <MuiTable
      columns={columns}
      rows={rows}
      // defaultExpanded={defaultExpanded}
      expandedColor='rgba(101, 129, 157, 0.1)'
      initialExpandedState={{ 1: true, 2: true }}
    />
  )
}

export default TreeTable
