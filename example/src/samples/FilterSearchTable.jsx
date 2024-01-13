import React from 'react'

import { MuiTable } from '@jazasoft/mui-table'

// const mills = ['Vardhman', 'Monti', 'Arvind', 'Laguna', 'Ranger']
const desserts = ['Frozen yoghurt', 'Ice cream sandwich', 'Eclair', 'Cupcake', 'Gingerbread']

const columns = [
  {
    dataKey: 'dessertId',
    title: 'Dessert',
    render: (value, shortValue, row) => row.dessert?.name,
    filterOptions: { filter: true, multiSelect: false }
  },
  { dataKey: 'style', title: 'Style' },
  {
    dataKey: 'status',
    title: 'Status',
    render: (value, shortValue) => (
      <span
        style={{
          padding: '3px 6px',
          borderRadius: 4,
          color: 'white',
          fontSize: 12,
          backgroundColor: value === 'New' ? 'blue' : value === 'Pending' ? 'orange' : 'green'
        }}
      >
        {value}
      </span>
    ),
    filterOptions: { filter: true, multiSelect: true }
  },
  { dataKey: 'label', title: 'Label', filterOptions: { filter: true } },
  { dataKey: 'color', title: 'Color', filterOptions: { filter: true } },
  { dataKey: 'fit', title: 'Fit/Block', length: 20 },
  { dataKey: 'composition', title: 'Fabric\nComposition' },
  { dataKey: 'placement', title: 'Fabric\nPlacement' },
  { dataKey: 'csv', title: 'CSV', filterOptions: { filter: true, showValueOnly: false } },
  { dataKey: 'width', title: 'Cuttable\nWidth (CM)' },
  { dataKey: 'shrinkage', title: 'Shrinkage' },
  { dataKey: 'mills', title: 'Mills', hidden: true, filterOptions: { filter: true, isCsvText: true, multiSelect: true } }
]

let rows = [
  {
    style: 'Curabitur sed',
    status: 'New',
    label: 'imperdiet, erat',
    color: 'Black',
    fit: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed',
    composition: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    placement: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    csv: 'Yes',
    width: 150,
    wash: 'No',
    shrinkage: 'eu nulla',
    mills: 'Vardhman,Monti'
  },
  {
    style: 'egestas. Aliquam',
    status: 'Pending',
    label: 'dis parturient',
    color: 'White',
    fit: 'Lorem ipsum dolor sit amet,',
    composition: 'Lorem ipsum dolor sit',
    placement: 'Lorem ipsum dolor sit amet, consectetuer adipiscing',
    csv: 'No',
    width: 158,
    wash: 'No',
    shrinkage: 'nec urna',
    mills: 'Monti'
  },
  {
    style: 'non, bibendum',
    status: 'Available',
    label: 'libero. Donec',
    color: 'Blue',
    fit: 'Lorem ipsum dolor sit amet, consectetuer',
    composition: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    placement: 'Lorem ipsum',
    csv: 'No',
    width: 149,
    wash: 'No',
    shrinkage: 'Sed eu',
    mills: 'Arvind, Monti'
  },
  {
    style: 'metus sit',
    status: 'Completed',
    label: 'Mauris magna.',
    color: 'Navy',
    fit: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    composition: 'Lorem',
    placement: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    csv: 'Yes',
    width: 160,
    wash: 'No',
    shrinkage: 'lorem, luctus',
    mills: 'Arvind, Monti'
  },
  {
    style: 'torquent per',
    status: 'New',
    label: 'feugiat. Lorem',
    color: 'Black',
    fit: 'Lorem',
    composition: 'Lorem ipsum dolor sit amet, consectetuer',
    placement: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    csv: 'No',
    width: 147,
    wash: 'Yes',
    shrinkage: 'eu turpis.',
    mills: 'Arvind, Laguna'
  },
  {
    style: 'lacinia. Sed',
    status: 'Pending',
    label: 'placerat eget,',
    color: 'White',
    fit: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur',
    composition: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    placement: 'Lorem ipsum dolor sit amet, consectetuer adipiscing',
    csv: 'Yes',
    width: 149,
    wash: 'No',
    shrinkage: 'et malesuada',
    mills: ''
  },
  {
    style: 'ultrices sit',
    status: 'Available',
    label: 'congue a,',
    color: 'Blue',
    fit: 'Lorem ipsum',
    composition: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur',
    placement: 'Lorem ipsum dolor sit',
    csv: 'Yes',
    width: 150,
    wash: 'No',
    shrinkage: 'arcu vel',
    mills: null
  },
  {
    style: 'urna. Ut',
    status: 'Completed',
    label: 'odio vel',
    color: 'Navy',
    fit: 'Lorem ipsum dolor sit amet, consectetuer',
    composition: 'Lorem ipsum dolor sit amet, consectetuer adipiscing',
    placement: 'Lorem ipsum',
    csv: 'No',
    width: 160,
    wash: 'No',
    shrinkage: 'Cras convallis',
    mills: 'Vardhman'
  },
  {
    style: 'tincidunt, neque',
    status: 'New',
    label: 'imperdiet nec,',
    color: 'Black',
    fit: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur',
    composition: 'Lorem ipsum dolor sit amet, consectetuer adipiscing',
    placement: 'Lorem',
    csv: 'No',
    width: 143,
    wash: 'No',
    shrinkage: 'Proin sed',
    mills: 'Vardhman,Ranger'
  },
  {
    style: 'ridiculus mus.',
    status: 'Pending',
    label: 'Cum sociis',
    color: 'White',
    fit: 'Lorem ipsum dolor',
    composition: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed',
    placement: 'Lorem ipsum dolor',
    csv: 'No',
    width: 158,
    wash: 'Yes',
    shrinkage: 'lorem ac',
    mills: 'Vardhman,Laguna,Monti'
  },
  {
    style: 'libero. Proin',
    status: 'Available',
    label: 'augue porttitor',
    color: 'Blue',
    fit: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    composition: 'Lorem ipsum dolor sit amet, consectetuer adipiscing',
    placement: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Curabitur sed',
    csv: 'No',
    width: 157,
    wash: 'Yes',
    shrinkage: 'ipsum dolor',
    mills: 'Monti,Laguna'
  },
  {
    style: 'sagittis lobortis',
    status: 'Completed',
    label: 'risus. Donec',
    color: 'Navy',
    fit: 'Lorem ipsum dolor sit',
    composition: 'Lorem ipsum',
    placement: 'Lorem ipsum dolor sit amet, consectetuer adipiscing',
    csv: 'No',
    width: 154,
    wash: 'No',
    shrinkage: 'gravida. Praesent',
    mills: 'Ranger,Laguna'
  },
  {
    style: 'ridiculus mus.',
    status: 'New',
    label: 'lacinia at,',
    color: 'Black',
    fit: 'Lorem ipsum dolor',
    composition: 'Lorem ipsum dolor sit amet,',
    placement: 'Lorem ipsum dolor sit amet, consectetuer',
    csv: 'No',
    width: 158,
    wash: 'No',
    shrinkage: 'Integer urna.',
    mills: 'Vardhman,Laguna,Monti,Ranger'
  },
  {
    style: 'dolor, nonummy',
    status: 'Pending',
    label: 'Donec nibh',
    color: 'White',
    fit: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    composition: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    placement: 'Lorem ipsum',
    csv: 'No',
    width: 158,
    wash: 'No',
    shrinkage: 'sed pede.',
    mills: ''
  },
  {
    style: 'eget, ipsum.',
    status: 'Available',
    label: 'rutrum eu,',
    color: 'Blue',
    fit: 'Lorem ipsum dolor sit amet,',
    composition: 'Lorem ipsum',
    placement: 'Lorem ipsum dolor sit',
    csv: 'Yes',
    width: 145,
    wash: 'Yes',
    shrinkage: 'ligula. Nullam',
    mills: 'Vardhman,Arvind,Ranger'
  },
  {
    style: 'Cum sociis',
    status: 'Completed',
    label: 'Nullam suscipit,',
    color: 'Navy',
    fit: 'Lorem ipsum dolor sit amet, consectetuer adipiscing',
    composition: 'Lorem ipsum dolor sit amet, consectetuer',
    placement: 'Lorem ipsum dolor sit amet, consectetuer adipiscing',
    csv: 'No',
    width: 150,
    wash: 'Yes',
    shrinkage: 'massa. Quisque',
    mills: 'Ranger'
  }
]

rows = rows.map((row) => {
  const idx = Math.round(Math.random() * 10) % 5
  return { ...row, dessertId: idx + 1, dessert: { id: idx + 1, name: desserts[idx] } }
})

const FilterSearchTable = () => {
  const onFilter = (filterValues) => {
    console.log({ filterValues })
  }
  return (
    <MuiTable
      title='My Table'
      columns={columns}
      rows={rows}
      pageable={true}
      toolbarDivider={false}
      onFilter={onFilter}
      // toolbarStyle={{backgroundColor: 'yellow'}}
      searchable={true}
      searchKeys={['style', 'label', 'width']}
      chipOptions={{ color: 'secondary' }}
    />
  )
}

export default FilterSearchTable
