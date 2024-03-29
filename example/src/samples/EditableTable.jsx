import React from 'react'

import { MuiTable, required, minValue } from '@jazasoft/mui-table'
import { useState } from 'react'

import CopyIcon from '@material-ui/icons/FileCopy'

const desserts = [
  { id: 1, name: 'Frozen yoghurt' },
  { id: 2, name: 'Ice cream sandwich' },
  { id: 3, name: 'Eclair' },
  { id: 4, name: 'Cupcake' },
  { id: 5, name: 'Gingerbread' }
]

const columns = [
  {
    dataKey: 'dessert',
    title: 'Dessert',
    inputType: 'auto-complete-input',
    fetchChoices: (searchText, rowList) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (rowList?.length > 0) {
            const rowMap = rowList.reduce((acc, row) => ({ ...acc, [row.id]: row.id }), {})
            const rowIds = Object.values(rowMap)
            const filteredDessert = desserts.filter((e) => rowIds.includes(e.id))
            resolve(filteredDessert)
          } else {
            const filteredDessert = desserts.filter((e) => searchText === '' || e.name.toLowerCase().includes(searchText?.toLowerCase()))
            resolve(filteredDessert)
          }
        }, 100)
      })
    },
    validate: required(),
    disabled: (row, dataKey) => row?.id === 3,
    render: (value) => desserts.find((e) => e.id === value)?.name
  },
  {
    dataKey: 'calories',
    title: 'Calories',
    align: 'right',
    inputType: 'text-input',
    options: { type: 'number' },
    // disabled: (row, dataKey) => row?.id === 1,
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
  { dataKey: 'protein', title: 'Protein', align: 'right' },
  {
    dataKey: 'file',
    title: 'File',
    inputType: 'file-input',
    options: { type: 'file', multiple: false },
    disabled: (row, dataKey) => row?.id === 4
  }
]

const rows = Array(15)
  .fill('')
  .map((_, idx) => ({
    id: idx + 1,
    dessert: desserts[Math.round(Math.random() * 10) % 5]?.id,
    // calories: Math.round(Math.random() * 500),
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
  const [editing, setEditing] = useState(false)
  const [rowList, setRowList] = useState(rows)
  const onInlineActionClick = (event, action, row, onActionComplete) => {
    onActionComplete()
  }

  const onSubmit = (values, form, onSubmitComplete) => {
    const rows = addTotalRow(values)
    onSubmitComplete(rows)
  }

  const onFooterActionClick = (event, action, rows) => {
    setEditing(action === 'edit')
  }

  const onToolbarActionClick = (event, action, rows) => {
    console.log({ row: { ...rows[0] } })
    const calories = rows[0]?.calories
    setRowList(rows.map((e) => ({ ...e, calories })))
    console.log({ rows, calories })
  }

  const onChange = (name, value, row, form) => {
    console.log({ row, name, value, form })
  }

  const onValidate = (values, form, onSubmitComplete) => {
    const errors = values?.rows.map((e) => {
      let error = {}
      if (!e.dessert) {
        error.dessert = 'Required'
      }
      if (e.calories < 0) {
        error.calories = 'Must be at least 0'
      }
      return error
    })
    if (errors.some((e) => Object.keys(e).length > 0)) {
      return { rows: errors }
    }
    return {}
  }

  const finalColumns = editing ? columns.map((c) => ({ ...c, title: c.dataKey === 'protein' ? 'Proton' : c.title })) : columns

  return (
    <MuiTable
      columns={finalColumns}
      // rows={addTotalRow(rows)}
      rows={rowList}
      pageable={true}
      editable={true}
      editing={false}
      toolbarActions={[
        { name: 'copy', tooltip: 'Copy Date', icon: <CopyIcon />, showLabel: true, options: { variant: 'outlined', style: { color: 'green' } } }
      ]}
      footerActions={[{ name: 'edit', tooltip: 'Update', options: { variant: 'outlined', color: 'secondary' } }]}
      showEditableActions={true}
      onRowAdd={(rows) => ({ sweet: true })}
      validate={onValidate}
      onChange={onChange}
      onSubmit={onSubmit}
      inlineActions={[{ name: 'delete', tooltip: 'Delete Row' }]}
      onInlineActionClick={onInlineActionClick}
      onFooterActionClick={onFooterActionClick}
      onToolbarActionClick={onToolbarActionClick}
    />
  )
}

export default EditableTable
