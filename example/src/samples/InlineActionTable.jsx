import React from 'react'

import HistoryIcon from '@material-ui/icons/History'

import { MuiTable } from '@jazasoft/mui-table'

const desserts = ['Frozen yoghurt', 'Ice cream sandwich', 'Eclair', 'Cupcake', 'Gingerbread']

const columns = [
  {
    dataKey: 'dessert',
    title: 'Dessert',
    inputType: 'select-input',
    choices: desserts.map((e) => ({ id: e, name: e })),
    options: { displayEmpty: true },
    filterOptions: { filter: true, multiSelect: true }
  },
  {
    dataKey: 'calories',
    title: 'Calories',
    align: 'right',
    inputType: 'text-input',
    options: { type: 'number' }
  },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right' },
  {
    dataKey: 'sweet',
    title: 'Sweet',
    align: 'right',
    inputType: 'boolean-input',
    render: (value) => (!!value ? 'Yes' : 'No'),
    options: { color: 'secondary' }
  },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right' },
  { dataKey: 'carbs', title: 'Carbohydrate (g)', align: 'right' },
  { dataKey: 'protein', title: 'Protein', align: 'right' }
]

const rows = Array(30)
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

const InlineEditableTable = () => {
  const onInlineActionClick = (event, action, row, onActionComplete) => {
    if (action === 'edit') {
      onActionComplete(row)
    } else if (action === 'add') {
      onActionComplete(row)
    } else if (action === 'history') {
      console.log({ action, row })
    }
  }
  return (
    <MuiTable
      columns={columns}
      rows={rows}
      pageable={true}
      searchable={true}
      searchKeys={['dessert']}
      inlineActions={[
        { name: 'add', tooltip: 'Add Row' },
        { name: 'edit', tooltip: 'Edit Row' },
        { name: 'history', tooltip: 'Row History', icon: <HistoryIcon /> }
      ]}
      actionPlacement='right'
      rowInsert='below'
      comparator={(a, b) => a.id - b.id}
      onInlineActionClick={onInlineActionClick}
    />
  )
}

export default InlineEditableTable
