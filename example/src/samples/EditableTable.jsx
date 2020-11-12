import React from 'react'

import { MuiTable, required, minValue } from '@jazasoft/mui-table'

const desserts = ['Frozen yoghurt', 'Ice cream sandwich', 'Eclair', 'Cupcake', 'Gingerbread']

const columns = [
  {
    dataKey: 'dessert',
    title: 'Dessert',
    inputType: 'select-input',
    choices: desserts.map((e) => ({ id: e, name: e })),
    options: { displayEmpty: true },
    validate: required(),
    disabled: (row, dataKey) => row?.id === 3
  },
  {
    dataKey: 'calories',
    title: 'Calories',
    align: 'right',
    inputType: 'text-input',
    options: { type: 'number' },
    disabled: (row, dataKey) => row?.id === 1,
    validate: minValue(0)
  },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right' },
  {
    dataKey: 'sweet',
    title: 'Sweet',
    align: 'right',
    inputType: 'boolean-input',
    render: (value) => (!!value ? 'Yes' : 'No'),
    options: { color: 'secondary' },
    disabled: (row, dataKey) => row?.id === 4
  },
  { dataKey: 'carbs', title: 'Carbohydrate (g)', align: 'right' },
  { dataKey: 'protein', title: 'Protein', align: 'right' }
]

const rows = Array(5)
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

const addTotalRow = (rows) => {
  let finalRows = [...rows]
  let totalRow = ['calories', 'fat', 'carbs', 'protein'].reduce(
    (acc, key) => ({
      ...acc,
      [key]: rows.reduce((acc, row) => acc + parseFloat(row[key]), 0)
    }),
    {}
  )
  finalRows.push({ ...totalRow, dessert: 'Total', id: rows.length + 1, totalRow: true })
  return finalRows
}

const EditableTable = () => {
  const onInlineActionClick = (event, action, row, onActionComplete) => {
    onActionComplete()
  }

  const onSubmit = (values, form, onSubmitComplete) => {
    const rows = addTotalRow(values)
    onSubmitComplete(rows)
  }

  return (
    <MuiTable
      columns={columns}
      rows={addTotalRow(rows)}
      pageable={true}
      editable={true}
      showEditableActions={true}
      onSubmit={onSubmit}
      inlineActions={[{ name: 'delete', tooltip: 'Delete Row' }]}
      onInlineActionClick={onInlineActionClick}
    />
  )
}

export default EditableTable
