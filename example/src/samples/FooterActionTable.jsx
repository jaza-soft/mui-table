import React from 'react'

import RunIcon from '@material-ui/icons/PlayCircleFilled'

import { MuiTable } from '@jazasoft/mui-table'

const desserts = ['Frozen yoghurt', 'Ice cream sandwich', 'Eclair', 'Cupcake', 'Gingerbread']

const columns = [
  { dataKey: 'dessert', title: 'Dessert' },
  { dataKey: 'calories', title: 'Calories', align: 'right' },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right' },
  { dataKey: 'sweet', title: 'Sweet', align: 'right', render: (value) => (!!value ? 'Yes' : 'No') },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right' },
  { dataKey: 'carbs', title: 'Carbohydrate (g)', align: 'right' },
  { dataKey: 'protein', title: 'Protein', align: 'right' }
]

const rows = Array(10)
  .fill('')
  .map((_, idx) => ({
    id: idx + 1,
    dessert: desserts[Math.round(Math.random() * 10) % 5],
    calories: Math.round(Math.random() * 500),
    fat: Math.round(Math.random() * 10),
    carbs: Math.round(Math.random() * 100),
    sweet: Math.round(Math.random() * 10) % 2 === 0,
    protein: (Math.random() * 10).toFixed(1)
  }))

const FooterActionTable = () => {
  const onFooterActionClick = (event, action, rows, filterValues, onActionComplete) => {
    if (action === 'run') {
      const newRows = rows.slice(0, rows.length - 2)
      setTimeout(() => onActionComplete(newRows), 2000)
    }
  }
  return (
    <MuiTable
      columns={columns}
      rows={rows}
      footerActions={[{ name: 'run', tooltip: 'Run', icon: <RunIcon />, options: { color: 'primary' } }]}
      onFooterActionClick={onFooterActionClick}
    />
  )
}

export default FooterActionTable
