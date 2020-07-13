# @jazasoft/mui-table

> Advanced React Data Table using Material UI

[![NPM](https://img.shields.io/npm/v/@jazasoft/mui-table.svg)](https://www.npmjs.com/package/@jazasoft/mui-table) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Features

- [x] Simple Table
- [ ] Inline Editing - Edit one row at once
- [x] Collective Editing - Edit entire table at once
- [x] Sorting & Selection
- [x] Pagination
- [ ] Search
- [ ] Spanning - Row Span & Col Span
- [ ] Fully Customizable
- [ ] Tree Data
- [ ] Drag & Drop for Editable Tree Data
- [ ] Elements
  - [x] TextInput
  - [ ] SelectInput
  - [ ] BooleanInput
  - [ ] DateInput
  - [ ] AutoCompleteInput
  - [ ] On Demand loading from remote for SelectInput and AutoCompleteInput

## Install

```bash
npm install --save @jazasoft/mui-table
```

## Usage

```jsx
import React, { Component } from 'react'

import { MuiTable } from '@jazasoft/mui-table'

const columns = [
  { dataKey: 'dessert', title: 'Dessert' },
  { dataKey: 'calories', title: 'Calories', align: 'right' },
  { dataKey: 'fat', title: 'Fat (g)', align: 'right' },
  { dataKey: 'carbs', title: 'Carbohydrate (g)', align: 'right' },
  { dataKey: 'protein', title: 'Protein', align: 'right' }
]

const rows = Array(10)
  .fill('')
  .map((_, idx) => ({
    dessert: `Dessert ${idx + 1}`,
    calories: Math.round(Math.random() * 500),
    fat: Math.round(Math.random() * 10),
    carbs: Math.round(Math.random() * 100),
    protein: (Math.random() * 10).toFixed(1)
  }))

class App extends Component {
  render() {
    return <MuiTable columns={columns} rows={rows} />
  }
}
```

## Types

**Column**

| Name          | Type        | Default Value | Description                                                                |
| ------------- | ----------- | ------------- |--------------------------------------------------------------------------- | 
| dataKey       | `string`    |               | Key in Object for this column                                              |
| title         | `string`    |               | Label for this column                                                      |
| align         | `string`    |               | Same as MUI TableCell Values - `inherit, center, justify, left, right`     |
| headerCellProps | `object`  |       `{}`    | MUI Table Cell Props to be passed to Header Cell                           |
| rowCellProps  | `object`    |      `{}`     | MUI Table Cell Props to be passed to Row Cell                              |

## Props

| Name          | Type        | Default Value | Description                                                                |
| ------------- | ----------- | ------------- |--------------------------------------------------------------------------- | 
| columns       | `column[]`  | `[]`          | List of Columns                                                            |
| rows          | `object[]`  | `[]`          | List of objects                                                            |
| toolbar       | `bool`      | `false`       | Whether to show toolbar                                                    |
| title         | `string`    | `Mui Table`   | Toolbar Title                                                              |
| editable      | `bool`      | `false`       | Table will become editable                                                 |
| selectable    | `bool`      | `false`       | Table will become Selectable                                               |
| selectAll     | `bool`      | `true`        | Applicable only when selectable is `true`, Select All Support              |
| pageable      | `bool`      | `false`       | Table will have pagination                                                 |
| pageSize      | `number`    | `10`         | Number records to show in one page. Values -  `10, 25`                      |
| sortable      | `bool`      | `false`       | Columns will become sortable                                               |
| comparator    | `function`  | `(a, b) => 0` | Sort Comparator when sortable is `false`                                   |
| tableProps    | `object`    | `{}`          | MUI Table props to be passed to Table                                      |
| idKey         | `string`    | `id`          | Identifier Key in Object. Required when table is selectable                |
| onSubmit      | `function`  |               | Submit function to be called when table is editable. Refer React Final Form|
| selectActions | `string[]`  | `['delete']`  | Select Actions. Values - `add, edit, delete`                               |
| onSelectActionClick | `function` |      | `(event, action, selectedRows) => {}`                                          |



## License

MIT © [zahidraza](https://github.com/zahidraza)
