import React from 'react'

import { MuiTable } from '@jazasoft/mui-table'

const columns = [
  { dataKey: 'dessert', title: 'Dessert' },
  { dataKey: 'calories', title: 'Calories', align: 'right' },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right' },
  { dataKey: 'carbs', title: 'Carbohydrate (g)', align: 'right' },
  { dataKey: 'protein', title: 'Protein', align: 'right' }
]

const rows = Array(15)
  .fill('')
  .map((_, idx) => ({
    id: idx + 1,
    dessert: `Dessert ${idx + 1}`,
    calories: Math.round(Math.random() * 500),
    fat: Math.round(Math.random() * 10),
    carbs: Math.round(Math.random() * 100),
    protein: (Math.random() * 10).toFixed(1)
  }))

const App = () => {
  const onSubmit = (values) => {
    console.log({ values })
  }

  const onSelectActionClick = (event, action, selectedRows) => {
    console.log({ action, selectedRows })
  }

  return (
    <MuiTable
      columns={columns}
      rows={rows}
      toolbar={false}
      pageable={true}
      editable={true}
      selectable={true}
      selectActions={['add', 'delete']}
      selectAll={false}
      onSubmit={onSubmit}
      onSelectActionClick={onSelectActionClick}
    />
  )
}

export default App
