import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { Form } from 'react-final-form'

import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'

import TableHead from './TableHead'
import Toolbar from './Toolbar'
import TextField from './TextField'
import TextInput from './TextInput'
import SelectInput from './SelectInput'
import BooleanInput from './BooleanInput'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  footerActions: {
    padding: '0.5em 1em'
  },
  justifyBetween: {
    justifyContent: 'space-between'
  },
  justifyRight: {
    justifyContent: 'flex-end'
  }
})

const MuiTable = (props) => {
  const {
    columns,
    rows,
    editable,
    selectable,
    selectAll,
    selectActions,
    sortable,
    pageable,
    toolbar,
    title,

    tableProps,
    idKey,
    onSubmit,
    validate,
    onSelectActionClick
  } = props

  const classes = useStyles()

  const [editing, setEditing] = React.useState(false)
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState(columns[0]?.dataKey)
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(props.pageSize)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectActionClick = (event, action) => {
    const selectedRows = rows.filter((row) => selected.includes(row[idKey]))
    onSelectActionClick && onSelectActionClick(event, action, selectedRows)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n[idKey])
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event, id) => {
    if (!selectable) return
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangePageSize = (event) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (id) => selected.indexOf(id) !== -1

  const comparator = sortable ? getComparator(order, orderBy) : props.comparator

  const initialValues = {
    rows: rows.slice(page * pageSize, page * pageSize + pageSize)
  }

  const totalPage =
    rows.length % pageSize === 0
      ? rows.length / pageSize
      : Math.ceil(rows.length / pageSize)

  return (
    <div style={{ margin: '2em' }}>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        validateOnBlur={true}
        mutators={{
          ...arrayMutators
        }}
        subscription={{ submitting: true, pristine: true }}
        initialValues={initialValues}
      >
        {({ handleSubmit, pristine, submitting }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Paper>
                {(toolbar || selected.length > 0) && (
                  <Toolbar
                    title={title}
                    selectedCount={selected.length}
                    selectActions={selectActions}
                    onSelectActionClick={handleSelectActionClick}
                  />
                )}
                <TableContainer>
                  <Table className={classes.table} {...tableProps}>
                    <TableHead
                      editing={editing}
                      selectable={selectable}
                      selectAll={selectAll}
                      sortable={sortable}
                      columns={columns}
                      classes={classes}
                      selectedCount={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={rows.length}
                    />

                    <TableBody>
                      {!editing
                        ? stableSort(rows, comparator)
                            .slice(page * pageSize, page * pageSize + pageSize)
                            .map((row, rowIdx) => {
                              const isItemSelected = isSelected(row[idKey])
                              const labelId = `enhanced-table-checkbox-${rowIdx}`

                              return (
                                <TableRow
                                  hover
                                  onClick={(event) =>
                                    handleClick(event, row[idKey])
                                  }
                                  role='checkbox'
                                  aria-checked={isItemSelected}
                                  tabIndex={-1}
                                  key={rowIdx}
                                  selected={isItemSelected}
                                >
                                  {selectable && (
                                    <TableCell padding='checkbox'>
                                      <Checkbox
                                        checked={isItemSelected}
                                        inputProps={{
                                          'aria-labelledby': labelId
                                        }}
                                      />
                                    </TableCell>
                                  )}

                                  {columns.map(
                                    (
                                      { dataKey, render, align, rowCellProps },
                                      colIdx
                                    ) => (
                                      <TableCell
                                        component={
                                          colIdx === 0 ? 'th' : undefined
                                        }
                                        scope={colIdx === 0 ? 'row' : undefined}
                                        padding={
                                          selectable && colIdx === 0
                                            ? 'none'
                                            : 'default'
                                        }
                                        key={`${rowIdx}-${colIdx}`}
                                        align={align}
                                        {...rowCellProps}
                                      >
                                        {typeof render === 'function'
                                          ? render(row[dataKey])
                                          : row[dataKey]}
                                      </TableCell>
                                    )
                                  )}
                                </TableRow>
                              )
                            })
                        : null}
                      {editable && editing && (
                        <FieldArray name='rows'>
                          {({ fields }) =>
                            fields.map((name, rowIdx) => (
                              <TableRow key={rowIdx}>
                                {columns.map(
                                  (
                                    {
                                      dataKey,
                                      inputType = 'text-field',
                                      render,
                                      choices,
                                      align,
                                      rowCellProps,
                                      options,
                                      validate
                                    },
                                    colIdx
                                  ) => (
                                    <TableCell
                                      key={`${rowIdx}-${colIdx}`}
                                      align={align}
                                      {...rowCellProps}
                                    >
                                      {inputType === 'text-field' && (
                                        <TextField
                                          name={`${name}.${dataKey}`}
                                          options={options}
                                          render={render}
                                        />
                                      )}
                                      {inputType === 'text-input' && (
                                        <TextInput
                                          name={`${name}.${dataKey}`}
                                          options={options}
                                          validate={validate}
                                        />
                                      )}
                                      {inputType === 'select-input' && (
                                        <SelectInput
                                          name={`${name}.${dataKey}`}
                                          choices={choices}
                                          options={options}
                                          validate={validate}
                                        />
                                      )}
                                      {inputType === 'boolean-input' && (
                                        <BooleanInput
                                          name={`${name}.${dataKey}`}
                                          options={options}
                                        />
                                      )}
                                    </TableCell>
                                  )
                                )}
                              </TableRow>
                            ))
                          }
                        </FieldArray>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <div
                  className={clsx(
                    classes.footerContainer,
                    pageable && editable && classes.justifyBetween,
                    !(pageable && editable) && classes.justifyRight
                  )}
                >
                  {editable && (
                    <div className={classes.footerActions}>
                      {!editing && (
                        <Button
                          variant='text'
                          color='primary'
                          onClick={() => setEditing(true)}
                          disabled={selected.length > 0}
                        >
                          Edit
                        </Button>
                      )}
                      {editing && (
                        <React.Fragment>
                          <Button
                            variant='text'
                            color='primary'
                            type='submit'
                            disabled={submitting || pristine}
                          >
                            Save
                          </Button>
                          <Button
                            style={{ marginLeft: '1em' }}
                            variant='text'
                            onClick={() => setEditing(false)}
                          >
                            Cancel
                          </Button>
                        </React.Fragment>
                      )}
                    </div>
                  )}

                  {pageable && (
                    <TablePagination
                      rowsPerPageOptions={[10, 25]}
                      component='div'
                      count={rows.length}
                      rowsPerPage={pageSize}
                      page={page}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangePageSize}
                      labelRowsPerPage='Page Size'
                      nextIconButtonProps={{
                        disabled: editing || page === totalPage - 1
                      }}
                      backIconButtonProps={{ disabled: editing || page === 0 }}
                      SelectProps={{
                        disabled: editing
                      }}
                    />
                  )}
                </div>
              </Paper>
            </form>
          )
        }}
      </Form>
    </div>
  )
}

const OptionType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
})

MuiTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string,
      title: PropTypes.string,
      inputType: PropTypes.oneOf([
        'text-field',
        'text-input',
        'select-input',
        'boolean-input',
        'date-input',
        'auto-complete-input'
      ]),
      // when inputType is 'select' or 'auto-complete'
      choices: PropTypes.oneOfType([
        PropTypes.arrayOf(OptionType),
        PropTypes.func
      ]),
      render: PropTypes.func,
      align: PropTypes.oneOf(['center', 'inherit', 'justify', 'left', 'right']),
      validate: PropTypes.func, // Validation function for TextInput and SelectInput
      options: PropTypes.object, // options to be passed to underllying editable component - Input, Select, Switch etc
      headerCellProps: PropTypes.object,
      rowCellProps: PropTypes.object
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  toolbar: PropTypes.bool,
  editable: PropTypes.bool,
  selectable: PropTypes.bool,
  selectAll: PropTypes.bool,
  sortable: PropTypes.bool,
  pageable: PropTypes.bool,
  tableProps: PropTypes.object,
  pageSize: PropTypes.oneOf([10, 25]),
  idKey: PropTypes.string, // Identifier Key in row object. This is used which selection
  selectActions: PropTypes.arrayOf(PropTypes.oneOf(['add', 'delete', 'edit'])),

  validate: PropTypes.func, // (values: FormValues) => Object | Promise<Object>
  onSubmit: PropTypes.func,
  onSelectActionClick: PropTypes.func, // (event, action, rows) => {}
  comparator: PropTypes.func
}
MuiTable.defaultProps = {
  columns: [],
  rows: [],
  title: 'Mui Table',
  toolbar: false,
  editable: false,
  selectable: false,
  selectAll: true,
  sortable: false,
  pageable: false,
  idKey: 'id',
  pageSize: 10,
  selectActions: ['delete'],
  onSubmit: () => {},
  comparator: (a, b) => 0
}

export default MuiTable
