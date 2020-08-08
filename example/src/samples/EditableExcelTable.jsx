import React from 'react'

import { MuiTable } from '@jazasoft/mui-table'

const desserts = ['Frozen yoghurt', 'Ice cream sandwich', 'Eclair', 'Cupcake', 'Gingerbread']

const columns = [
  {
    dataKey: 'dessert',
    title: 'Dessert',
    align: 'left',
    inputType: 'select-input',
    choices: desserts.map((e) => ({ id: e, name: e }))
  },
  { dataKey: 'style', title: 'Style', inputType: 'text-input' },
  {
    dataKey: 'status',
    title: 'Status',
    render: (value, shortValue) =>
      value ? (
        <span
          style={{
            padding: '3px 6px',
            borderRadius: 4,
            color: 'white',
            fontSize: 14,
            backgroundColor: value === 'New' ? 'blue' : value === 'Pending' ? 'orange' : 'green'
          }}
        >
          {value}
        </span>
      ) : null
  },
  { dataKey: 'label', title: 'Label' },
  { dataKey: 'color', title: 'Color', inputType: 'text-input' },
  { dataKey: 'fit', title: 'Fit/Block', length: 30, inputType: 'text-input', options: { style: { width: 200 } } },
  { dataKey: 'composition', title: 'Fabric\nComposition', inputType: 'text-input', options: { style: { width: 200 } } },
  { dataKey: 'placement', title: 'Fabric\nPlacement', inputType: 'text-input', options: { style: { width: 200 } } },
  //   { dataKey: 'csv', title: 'CSV', inputType: 'boolean-input', options: { color: 'secondary' } },
  {
    dataKey: 'csv',
    title: 'CSV',
    inputType: 'select-input',
    align: 'center',
    choices: [
      { id: 'Yes', name: 'Yes' },
      { id: 'No', name: 'No' }
    ],
    options: { style: { width: 75 } }
  },
  { dataKey: 'width', title: 'Cuttable\nWidth (CM)' },
  { dataKey: 'shrinkage', title: 'Shrinkage' },
  { dataKey: 'mill', title: 'Mill' }
]

const rows = [
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
    mill: 'accumsan laoreet'
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
    mill: 'Cum sociis'
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
    mill: 'adipiscing lobortis'
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
    mill: 'egestas. Aliquam'
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
    mill: 'risus. Quisque'
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
    mill: 'luctus vulputate,'
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
    mill: 'montes, nascetur'
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
    mill: 'mi fringilla'
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
    mill: 'sed sem'
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
    mill: 'accumsan convallis,'
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
    mill: 'eleifend non,'
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
    mill: 'tempor erat'
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
    mill: 'congue a,'
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
    mill: 'auctor. Mauris'
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
    mill: 'Integer vitae'
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
    mill: 'quis diam'
  }
].map((e, idx) => ({ ...e, id: idx + 1, dessert: desserts[Math.round(Math.random() * 10) % 5] }))

const EditableExcelTable = () => {
  const onSubmit = (values, form, onSubmitComplete) => {
    onSubmitComplete(values)
  }

  return <MuiTable columns={columns} rows={rows} toolbar={true} pageable={true} editable={true} variant='excel' fontSize={14} onSubmit={onSubmit} />
}

export default EditableExcelTable
