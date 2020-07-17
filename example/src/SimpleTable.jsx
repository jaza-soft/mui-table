import React from 'react'

import { MuiTable } from '@jazasoft/mui-table'

const desserts = ['Frozen yoghurt', 'Ice cream sandwich', 'Eclair', 'Cupcake', 'Gingerbread']

const columns = [
  {
    dataKey: 'dessert',
    title: 'Dessert',
    linkPath: (row, dataKey) => console.log({ row, dataKey })
  },
  {
    dataKey: 'calories',
    title: 'Calories',
    align: 'right'
  },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right' },
  {
    dataKey: 'sweet',
    title: 'Sweet',
    align: 'right',
    render: (value) => (!!value ? 'Yes' : 'No')
  },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right' },
  { dataKey: 'carbs', title: 'Carbohydrate (g)', align: 'right' },
  { dataKey: 'protein', title: 'Protein', align: 'right' }
]

const rows = desserts.map((dessert, idx) => ({
  id: idx + 1,
  dessert,
  calories: Math.round(Math.random() * 500),
  fat: Math.round(Math.random() * 10),
  carbs: Math.round(Math.random() * 100),
  sweet: Math.round(Math.random() * 10) % 2 === 0,
  protein: (Math.random() * 10).toFixed(1)
}))

const SimpleTable = () => {
  return <MuiTable columns={columns} rows={rows} />
}

export default SimpleTable
