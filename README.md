# @jazasoft/mui-table

> Advanced React Data Table using Material UI

[![NPM](https://img.shields.io/npm/v/@jazasoft/mui-table.svg)](https://www.npmjs.com/package/@jazasoft/mui-table) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Features

- [x] Simple Table
- [ ] Inline Editing - Edit one row at once
- [ ] Collective Editing - Edit entire table at once
- [ ] Sorting & Selection
- [ ] Search
- [ ] Spanning - Row Span & Col Span
- [ ] Fully Customizable
- [ ] Tree Data
- [ ] Drag & Drop for Editable Tree Data
- [ ] Elements
  - [ ] TextInput
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

import MuiTable from '@jazasoft/mui-table'

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

## License

MIT © [zahidraza](https://github.com/zahidraza)
