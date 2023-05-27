import React from 'react'

import { MuiTable } from '@jazasoft/mui-table'
// import { columns, rows } from '../data'

const desserts = ['Frozen yoghurt', 'Ice cream sandwich', 'Eclair', 'Cupcake', 'Gingerbread']

const columns = [
  {
    dataKey: 'dessert',
    title: 'Dessert',
    align: 'center',
    linkPath: (row, dataKey) => console.log({ row, dataKey }),
    colSpan: ({ rowIdx }) => (rowIdx === 0 ? 3 : 1)
  },
  {
    dataKey: 'calories',
    title: 'Calories',
    align: 'right',
    colSpan: ({ rowIdx }) => (rowIdx === 0 ? 0 : 1)
  },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right', colSpan: ({ rowIdx }) => (rowIdx === 0 ? 0 : 1) },
  {
    dataKey: 'sweet',
    title: 'Sweet',
    align: 'center',
    render: (value) => (!!value ? 'Yes' : 'No'),
    colSpan: ({ rowIdx }) => (rowIdx === 0 ? 4 : 1),
    headerCellProps: { style: { borderLeft: '1px solid rgba(224, 224, 224, 1)' } },
    rowCellProps: { style: { borderLeft: '1px solid rgba(224, 224, 224, 1)' } }
  },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right', colSpan: ({ rowIdx }) => (rowIdx === 0 ? 0 : 1) },
  { dataKey: 'carbs', title: 'Carbohydrate (g)', align: 'right', colSpan: ({ rowIdx }) => (rowIdx === 0 ? 0 : 1) },
  { dataKey: 'protein', title: 'Protein', align: 'right', colSpan: ({ rowIdx }) => (rowIdx === 0 ? 0 : 1) }
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
  const groupRow = { dessert: 'G1', sweet: 'G2' }
  const headerRows = [groupRow, columns.reduce((acc, c) => ({ ...acc, [c.dataKey]: c.title }), {})]

  return (
    <MuiTable
      columns={columns}
      headerRows={headerRows}
      rows={rows}
      rowStyle={({ rowIdx }) => ({ backgroundColor: rowIdx % 2 === 0 ? '#f0f0f0' : 'none' })}
    />
  )
}

export default SimpleTable
