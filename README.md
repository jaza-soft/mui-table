# @jazasoft/mui-table

> Advanced React Data Table using Material UI

[![NPM](https://img.shields.io/npm/v/@jazasoft/mui-table.svg)](https://www.npmjs.com/package/@jazasoft/mui-table) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Features

- [x] Simple Table
- [x] Collective Editing - Edit entire table at once
- [x] Sorting
- [x] Selection
- [x] Pagination
- [x] Filter & Search
- [x] Inline Editing - Edit one row at once
- [x] Add/Remove Row
- [x] Horizonatl Scroll/ Force Line Wrap on Specified characters
- [x] Variant - default, excel
- [x] Tree Table
- [x] Custom Footer Actions
- [ ] Column selection
- [ ] Spanning - Row Span & Col Span
- [ ] Expandable View/ Modal View/ Sidebar View
- [ ] Fully Customizable
- [ ] Fixed Header
- [ ] Drag & Drop for Editable Tree Data
- [ ] Change Sequence using Drag & Drop
- [ ] Elements
  - [x] TextField
  - [x] TextInput
  - [x] SelectInput
  - [x] BooleanInput
  - [ ] DateInput
  - [ ] AutoCompleteInput
  - [ ] On Demand loading from remote for SelectInput and AutoCompleteInput

[Examples](https://codesandbox.io/s/optimistic-shamir-u78kl)

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

**Action**

| Name    | Type           | Default Value | Description                                                 |
| ------- | -------------- | ------------- | ----------------------------------------------------------- |
| name    | `string`       |               | `Required`. Name of action                                  |
| tooltip | `string`       |               | `Optional`. Tooltip for the action                          |
| icon    | `ReactElement` |               | Icon for this action. Required for custom actions.          |
| options | `object`       |               | options will be passed down to Button or IconButton element |

**Column**

| Name            | Type       | Default Value  | Description                                                                                                                                                                      |
| --------------- | ---------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dataKey         | `string`   |                | Key in Object for this column                                                                                                                                                    |
| title           | `string`   |                | Label for this column                                                                                                                                                            |
| inputType       | `string`   | `'text-field'` | Type of Input when table is editable. Values - `'text-field', 'text-input', 'select-input', 'boolean-input', 'date-input', 'auto-complete-input'`                                |
| choices         | `object[]` | `[]`           | List of Choices when inputType is `'select-input'` or `'auto-complete-input'`. Object Type - `{id: string\|number, name: string}`                                                |
| render          | `function` |                | render function if custom rendering is required. signature - `(value) => ?any`                                                                                                   |
| validate        | `function` |                | field validation function. `(value: ?any, allValues: Object, meta: ?FieldState) => ?any`                                                                                         |
| options         | `object`   | `{}`           | props to be passed to underlying editable component - Input, Select, Switch etc                                                                                                  |
| disabled        | `function` |                | Disable Editable cells conditionally. Entire columns can be disabled using `options.disabled`. If both are provided, this func will have high priority. `(row, dataKey) => bool` |
| align           | `string`   |                | Same as MUI TableCell Values - `inherit, center, justify, left, right`                                                                                                           |
| linkPath        | `function` |                | It will turn field to link. `(row, dataKey) => Path:String`                                                                                                                      |
| length          | `number`   |                | No. of characters to show or force text wrap depending on value of `cellOverFlow` prop of table                                                                                  |
| filterOptions   | `object`   | `{}`           | Filter Options - `{filter: bool, multiSelect: bool, showValueOnly: bool}`                                                                                                        |
| headerCellProps | `object`   | `{}`           | MUI Table Cell Props to be passed to Header Cell                                                                                                                                 |
| rowCellProps    | `object`   | `{}`           | MUI Table Cell Props to be passed to Row Cell                                                                                                                                    |

## Props

| Name                 | Type               | Default Value           | Description                                                                                                                                                                    |
| -------------------- | ------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| columns              | `column[]`         | `[]`                    | List of Columns                                                                                                                                                                |
| rows                 | `object[]`         | `[]`                    | List of objects                                                                                                                                                                |
| toolbar              | `bool`             | `false`                 | Whether to show toolbar                                                                                                                                                        |
| toolbarDivider       | `bool`             | `true`                  | Whether to show Divider between Toolbar and Table Content or not                                                                                                               |
| title                | `string`           | `Mui Table`             | Toolbar Title                                                                                                                                                                  |
| editable             | `bool`             | `false`                 | Table will become editable                                                                                                                                                     |
| enableRowAddition    | `bool`             | `false`                 | Whether row addition should be enabled in editable mode.                                                                                                                       |
| selectAll            | `bool`             | `true`                  | Applicable only when selectable is `true`, Select All Support                                                                                                                  |
| pageable             | `bool`             | `false`                 | Table will have pagination                                                                                                                                                     |
| pageSize             | `number`           | `10`                    | Number records to show in one page. Values - `10, 25`                                                                                                                          |
| sortable             | `bool`             | `false`                 | Columns will become sortable                                                                                                                                                   |
| searchable           | `bool`             | `false`                 | Enable Search in Table                                                                                                                                                         |
| searchKeys           | `string[]`         | `['name']`              | Keys on which search will apply                                                                                                                                                |
| tableProps           | `object`           | `{}`                    | MUI Table props to be passed to Table                                                                                                                                          |
| idKey                | `string`           | `id`                    | Identifier Key in row object. This is used for selection and in tree table                                                                                                     |
| parnetIdKey          | `string`           | `parentId`              | Identifier Key of parent in row object. This is used in tree table                                                                                                             |
| disabledElement      | `string`           | `input`                 | Element to use when editable element is disabled. Values - `field, input`                                                                                                      |
| cellLength           | `number`           | `30`                    | Default value of Cell Character Length when cell specific length is not provided                                                                                               |
| cellOverFlow         | `string`           | `tooltip`               | Content behavior when cell content is greater than cell length. Values - `tooltip, wrap`                                                                                       |
| variant              | `string`           | `default`               | Select Table Variant. Values - `default, excel`                                                                                                                                |
| fontSize             | `number`           | `12`                    | Font Size                                                                                                                                                                      |
| emptyMessage         | `string`           | `No records available!` | Message when rows is empty                                                                                                                                                     |
| expandedColor        | `string`           | `none`                  | Background Color of Expanded Row                                                                                                                                               |
| childIndent          | `string`           | `12`                    | Left Indentation of Child in pixel                                                                                                                                             |
| initialExpandedState | `string`           | `null`                  | Inintial Expanded State. signature - `{[idKey]: true\|false}`                                                                                                                  |
| selectActions        | `Action[]`         | `[{name: 'delete'}]`    | Select Actions. Standard actions - `add, edit, delete`                                                                                                                         |
| toolbarActions       | `Action[]`         | `[]`                    | Toolbar Actions. Standard actions - `column`. Not Implemented yet                                                                                                              |
| inlineActions        | `Action[]`         | `[]`                    | Inline Actions. Standard actions - `add, duplicate, edit, delete`.                                                                                                             |
| footerActions        | `Action[]`         | `[]`                    | Custom Footer Actions. Standard actions - `edit`.                                                                                                                              |
| actionPlacement      | `string`           | `right`                 | Placement of action buttons. Values - `left, right`                                                                                                                            |
| rowInsert            | `string`           | `below`                 | Placement row to insert for `add, duplicate` inline actions. Values - `above, below`                                                                                           |
| rowAddCount          | `number`           | `3`                     | Number of rows to add in editable mode                                                                                                                                         |
| showEditableActions  | `bool`             | `false`                 | Show actions - `add, addChild, delete` in editiable mode                                                                                                                       |
| defaultExpanded      | `bool \|function`  |                         | default expanded state. Signature - `bool \| (row, level) => bool`.                                                                                                            |
| selectable           | `bool \| function` | `false`                 | Selectable Rows. `bool \| (row) => bool`                                                                                                                                       |
| onSubmit             | `function`         |                         | Submit function to be called when table is editable. `(values, form, onSubmitComplete) => {}`. call `onSubmitComplete` with updated rows to indicate that submit is complete   |
| validate             | `function`         |                         | Called before onSubmit. `(values: FormValues) => Object \| Promise<Object>`                                                                                                    |
| comparator           | `function`         | `(a, b) => 0`           | Sort Comparator when sortable is `false`                                                                                                                                       |
| onSelectActionClick  | `function`         |                         | Signature - `(event, action, selectedRows, onActionComplete: func) => void`. call `onActionComplete` to indicate that action is completed                                      |
| onToolbarActionClick | `function`         |                         | Signature - `(event, action) => void`.                                                                                                                                         |
| onTreeExapand        | `function`         |                         | Function called on expand click. Signature - `(event, row, isExpanded) => void`.                                                                                               |
| onInlineActionClick  | `function`         |                         | Signature - `(event, action, row, onActionComplete: func) => void`. call `onActionComplete` with updated row data after action is completed                                    |
| onFooterActionClick  | `function`         |                         | Signature - `(event, action, rows, onActionComplete: func) => void`. call `onActionComplete` with updated row data after action is completed                                   |
| hasRowsChanged       | `function`         | `default function`      | Signature - `(rows) => Key: String`. Function is called to detect whether rows props has changed. Default function detects changes on length of rows and id, modifiedAt fields |

## License

MIT © [Jaza Software](https://jaza-soft.com)
