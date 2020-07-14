import React from 'react'

import { MuiTable } from '@jazasoft/mui-table'

const required = (value) => (value ? undefined : 'Required')

const desserts = [
  'Frozen yoghurt',
  'Ice cream sandwich',
  'Eclair',
  'Cupcake',
  'Gingerbread'
]

const columns = [
  {
    dataKey: 'dessert',
    title: 'Dessert',
    inputType: 'select-input',
    choices: desserts.map((e) => ({ id: e, name: e })),
    options: { displayEmpty: true, style: { width: 200 } },
    validate: required,
    linkPath: (row, dataKey) => console.log({ row, dataKey }),
    disabled: (row, dataKey) => row?.idx === 3
  },
  {
    dataKey: 'calories',
    title: 'Calories',
    align: 'right',
    inputType: 'text-input',
    options: { type: 'number', style: { width: 100 } },
    disabled: (row, dataKey) => row?.idx === 1
  },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right' },
  {
    dataKey: 'sweet',
    title: 'Sweet',
    inputType: 'boolean-input',
    render: (value) => (!!value ? 'Yes' : 'No'),
    options: { color: 'secondary' },
    align: 'right',
    disabled: (row, dataKey) => row?.idx === 4
  },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right' },
  { dataKey: 'carbs', title: 'Carbohydrate (g)', align: 'right' },
  { dataKey: 'protein', title: 'Protein', align: 'right' }
]

const rows = Array(15)
  .fill('')
  .map((_, idx) => ({
    idx,
    id: Math.ceil((idx + 1) / 2),
    dessert: desserts[Math.round(Math.random() * 10) % 5],
    calories: Math.round(Math.random() * 500),
    fat: Math.round(Math.random() * 10),
    carbs: Math.round(Math.random() * 100),
    sweet: Math.round(Math.random() * 10) % 2 === 0,
    protein: (Math.random() * 10).toFixed(1)
  }))

const App = () => {
  const validate = (values) => {
    // console.log('validate')
    // console.log({ values })
    // return { rows: [{ dessert: 'Required' }] }
  }
  const onSubmit = (values) => {
    console.log('onSubmit')
    console.log({ values })
    alert('onSubmit clicked')
  }

  const onSelectActionClick = (event, action, selectedRows) => {
    console.log({ action, selectedRows })
    alert('onSelectActionClick clicked. action - ' + action)
  }

  return (
    <MuiTable
      columns={columns}
      rows={rows}
      // sortable={true}
      toolbar={true}
      pageable={true}
      editable={true}
      selectable={(row) => row?.idx % 2 === 0}
      selectActions={['add', 'delete']}
      // selectAll={false}
      onSubmit={onSubmit}
      validate={validate}
      onSelectActionClick={onSelectActionClick}
      // tableProps={{size: 'small'}}
    />
  )
}

export default App
