import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import SimpleTable from './samples/SimpleTable'
import PageableTable from './samples/PageableTable'
import SelectableTable from './samples/SelectableTable'
import SortableTable from './samples/SortableTable'
import EditableTable from './samples/EditableTable'
import ScrollableTable from './samples/ScrollableTable'
import EditableExcelTable from './samples/EditableExcelTable'
import FilterSearchTable from './samples/FilterSearchTable'
import InlineActionTable from './samples/InlineActionTable'
import InlineEditableTable from './samples/InlineEditableTable'

const tables = {
  simple: { title: 'Simple Table', table: <SimpleTable /> },
  pageable: { title: 'Pageable Table', table: <PageableTable /> },
  selectable: { title: 'Selectable Table', table: <SelectableTable /> },
  sortable: { title: 'Sortable Table', table: <SortableTable /> },
  scrollable: { title: 'Scrollable Table', table: <ScrollableTable /> },
  editable: { title: 'Editable Table', table: <EditableTable /> },
  excelVariant: { title: 'Editable Table - Excel Variant', table: <EditableExcelTable /> },
  filterSearch: { title: 'Filter & Search Table', table: <FilterSearchTable /> },
  InlineAction: { title: 'Inline Actions Table', table: <InlineActionTable /> },
  InlineEditable: { title: 'Inline Editable Table', table: <InlineEditableTable /> }
}

const useStyles = makeStyles({
  root: {
    padding: '1.5em'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  content: {
    margin: '1.5em 0'
  },
  button: {
    marginRight: '2em',
    marginBottom: '1em'
  }
})

const App = () => {
  const classes = useStyles()

  const [table, setTable] = React.useState()

  return (
    <div className={classes.root}>
      {/** Header */}
      <div className={classes.header}>
        <Typography variant='h5'>{table ? tables[table]?.title : 'Mui Table Examples'}</Typography>

        {table && (
          <Button variant='contained' onClick={() => setTable(null)}>
            Back
          </Button>
        )}
      </div>

      {/**Content */}
      <div className={classes.content}>
        {table && tables[table]?.table}
        {!table &&
          Object.keys(tables).map((key) => (
            <Button key={key} className={classes.button} variant='contained' onClick={() => setTable(key)}>
              {tables[key]?.title}
            </Button>
          ))}
      </div>
    </div>
  )
}

export default App
