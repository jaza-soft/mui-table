import React from 'react'

import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import SimpleTable from './SimpleTable'
import PageableTable from './PageableTable'
import SelectableTable from './SelectableTable'
import SortableTable from './SortableTable'
import EditableTable from './EditableTable'
import ScrollableTable from './ScrollableTable'
import EditableExcelTable from "./EditableExcelTable";

const tables = {
  simple: { title: 'Simple Table', table: <SimpleTable /> },
  pageable: { title: 'Pageable Table', table: <PageableTable /> },
  selectable: { title: 'Selectable Table', table: <SelectableTable /> },
  sortable: { title: 'Sortable Table', table: <SortableTable /> },
  editable: { title: 'Editable Table', table: <EditableTable /> },
  scrollable: { title: 'Scrollable Table', table: <ScrollableTable /> },
  excelVariant: { title: 'Excel Table - Editable', table: <EditableExcelTable /> }
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

  const [table, setTable] = React.useState(null)

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
