import React from 'react'

import DoneIcon from '@material-ui/icons/Done'

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

const rowList = Array(30)
  .fill('')
  .map((_, idx) => ({
    id: idx + 1,
    itemId: Math.ceil((idx + 1) / 2),
    dessert: desserts[Math.round(Math.random() * 10) % 5],
    calories: Math.round(Math.random() * 500),
    fat: Math.round(Math.random() * 10),
    carbs: Math.round(Math.random() * 100),
    sweet: Math.round(Math.random() * 10) % 2 === 0,
    protein: (Math.random() * 10).toFixed(1)
  }))

const SelectableTable = () => {
  const [rows, setRows] = React.useState(rowList)

  const onSelectActionClick = (event, action, selectedRows, onActionComplete) => {
    if (action === 'delete') {
      const idSet = new Set()
      selectedRows.forEach((e) => idSet.add(e.itemId))
      const itemIds = [...idSet]
      let newRows = rows.filter((e) => !itemIds.includes(e.itemId))
      setRows(newRows)
    }
    console.log({ event, action, selectedRows })
    onActionComplete()
  }

  return (
    <MuiTable
      columns={columns}
      rows={rows}
      pageable={true}
      selectable={(row) => row?.id % 2 === 1}
      selectAll={false}
      selectActions={[
        { name: 'delete', tooltip: 'Delete Rows' },
        { name: 'custom', tooltip: 'Custom Action', icon: <DoneIcon /> }
      ]}
      onSelectActionClick={onSelectActionClick}
      idKey='itemId'
    />
  )
}

export default SelectableTable
