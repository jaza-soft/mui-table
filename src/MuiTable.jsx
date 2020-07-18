import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

// final-form
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { Form } from 'react-final-form'

// material-ui
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
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'

// perfect-scroll-bar
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'

// local
import Tooltip from './components/Tooltip'
import TableHead from './components/TableHead'
import Toolbar from './components/Toolbar'
import FilterList from './components/FilterList'
import TextField from './components/TextField'
import TextInput from './components/TextInput'
import SelectInput from './components/SelectInput'
import BooleanInput from './components/BooleanInput'

import { multiLineText, getDistinctValues } from './utils/helper'

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
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy)
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

const applyFilter = (rows, filterValues, idKey, hasIdKey) => {
  const dataKeys = Object.keys(filterValues)
  let filteredRows = rows.filter((row) => {
    let result = true
    for (let i = 0; i < dataKeys.length; i++) {
      const dataKey = dataKeys[i]
      const value = filterValues[dataKey]
      if (Array.isArray(value)) {
        if (value.length > 0) {
          const matchCount = value.filter((v) => v === row[dataKey]).length
          if (matchCount === 0) {
            result = false
            break
          }
        }
      } else {
        if (value !== row[dataKey]) {
          result = false
          break
        }
      }
    }
    return result
  })

  if (hasIdKey) {
    const ids = getDistinctValues(filteredRows.map((row) => row[idKey]))
    return rows.filter((row) => ids.includes(row[idKey]))
  }

  return filteredRows
}

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    whiteSpace: 'pre'
  },
  excelTable: {
    minWidth: 650,
    whiteSpace: 'pre',
    '& th, & td': {
      border: '1px solid rgba(224, 224, 224, 0.5)'
    }
  },
  headerCell: (props) => ({
    padding: '12px 8px',
    fontSize: theme.typography.pxToRem(props.fontSize),
    color: '#3C4858'
  }),
  rowCell: (props) => ({
    padding: '8px',
    fontSize: theme.typography.pxToRem(props.fontSize)
  }),
  inputPadding: (props) => ({
    padding: props.variant === 'excel' ? 0 : '0px 8px'
  }),
  footerContainer: (props) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: props.pageable && props.editable ? 'space-between' : 'flex-end'
  }),
  footerActions: {
    padding: '0.5em 1em'
  },
  link: {
    color: theme.palette.primary.main,
    cursor: 'pointer'
  },
  emptyMessage: {
    textAlign: 'center'
  }
}))

const MuiTable = (props) => {
  const {
    columns,
    rows,
    editable,
    selectable,
    selectAll,
    selectActions,
    toolbarActions,
    sortable,
    pageable,
    toolbar,
    toolbarDivider,
    title,
    tableProps,
    idKey,
    disabledElement,
    cellLength,
    cellOverFlow,
    variant,
    fontSize,
    onSubmit,
    validate,
    onSelectActionClick
  } = props

  const [editing, setEditing] = React.useState(false)
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState(columns[0]?.dataKey)
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(props.pageSize)
  const [key, setKey] = React.useState(0) // To Reinitialize form if sorting changes
  const [filterValues, setFilterValues] = React.useState({})

  const classes = useStyles({ variant, pageable, editable, fontSize, editing })

  /*External handler functions */
  const handleSelectActionClick = (event, action) => {
    const selectedRows = rows.filter((row) => selected.includes(row[idKey]))
    const onActionComplete = () => setSelected([])
    onSelectActionClick && onSelectActionClick(event, action, selectedRows, onActionComplete)
  }

  const handleSubmit = (values, form, complete) => {
    const onSubmitComplete = () => {
      setEditing(false)
      complete()
    }
    onSubmit && onSubmit(values?.rows, form, onSubmitComplete)
  }

  /*Internal Handler functions */
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setKey(key + 1)
  }

  const updateFilter = (dataKey, value) => {
    setFilterValues((prevValues) => ({ ...prevValues, [dataKey]: value }))
  }

  const resetFilter = () => {
    setFilterValues({})
  }

  const removeFilter = (dataKey, value) => {
    const prevValue = filterValues[dataKey]
    let newFilterValues = { ...filterValues }
    if (Array.isArray(prevValue)) {
      newFilterValues[dataKey] = prevValue.filter((e) => e !== value)
    } else {
      delete newFilterValues[dataKey]
    }
    setFilterValues(newFilterValues)
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
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
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

  
  const hasIdKey = rows.filter((row) => row.hasOwnProperty(idKey)).length > 0 // Check Whether idKey exists in rows

  const comparator = sortable ? getComparator(order, orderBy) : props.comparator

  // Filter & Sort
  let rowList = applyFilter(rows, filterValues, idKey, hasIdKey)
  rowList = stableSort(rowList, comparator)

  // pagination
  const totalPage = rowList.length % pageSize === 0 ? rowList.length / pageSize : Math.ceil(rowList.length / pageSize)
  const startIdx = page * pageSize
  const endIdx = pageable ? page * pageSize + pageSize : rowList.length
  rowList = rowList.slice(startIdx, endIdx)

  const initialValues = { rows: rowList }

  // const selectedCount = rowList?.filter((row) => selected?.includes(row[idKey])).length
  const selectedCount = selected.length

  const filterColumns = columns
    .filter((c) => c.filterOptions?.filter)
    .map((c) => ({
      dataKey: c.dataKey,
      title: c.title,
      multiSelect: c.filterOptions?.multiSelect,
      choices: getDistinctValues(rows.map((row) => row[c.dataKey]).filter((e) => typeof e === 'string' || typeof e === 'number')).map((e) => ({
        id: e,
        name: e
      }))
    }))

  const filterList = Object.keys(filterValues).flatMap((dataKey) => {
    let result = []
    const value = filterValues[dataKey]
    const column = columns.find((c) => c.dataKey === dataKey) || {}
    if (Array.isArray(value)) {
      result = value.map((v) => ({ dataKey, title: column?.title, value: v, showValueOnly: column?.filterOptions?.showValueOnly }))
    } else {
      result = [{ dataKey, title: column?.title, value, showValueOnly: column?.filterOptions?.showValueOnly }]
    }
    return result
  })

  const filterProps = {
    columns: filterColumns,
    filterValues,
    updateFilter,
    resetFilter
  }

  return (
    <div>
      <Form
        key={key}
        onSubmit={handleSubmit}
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
                    selectedCount={selectedCount}
                    selectActions={selectActions}
                    toolbarActions={toolbarActions}
                    filterProps={filterProps}
                    onSelectActionClick={handleSelectActionClick}
                  />
                )}

                <FilterList data={filterList} removeFilter={removeFilter} />

                {toolbarDivider && (variant !== 'excel' || !editing) && <Divider light />}

                <TableContainer>
                  <PerfectScrollbar>
                    <Table
                      className={clsx({ [classes.table]: true, [classes.excelTable]: variant === 'excel' && editing }, tableProps?.className)}
                      {...tableProps}
                    >
                      <TableHead
                        editing={editing}
                        selectable={selectable}
                        selectAll={selectAll}
                        sortable={sortable}
                        columns={columns}
                        classes={classes}
                        selectedCount={selectedCount}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                      />

                      <TableBody>
                        {!editing ? (
                          rowList.length > 0 ? (
                            rowList.map((row, rowIdx) => {
                              const isItemSelected = isSelected(row[idKey])
                              const labelId = `enhanced-table-checkbox-${rowIdx}`
                              const selectDisabled = typeof selectable === 'function' && !selectable(row)
                              return (
                                <TableRow hover role='checkbox' aria-checked={isItemSelected} tabIndex={-1} key={rowIdx} selected={isItemSelected}>
                                  {!!selectable && (
                                    <TableCell padding='checkbox'>
                                      {!selectDisabled && (
                                        <Checkbox
                                          checked={isItemSelected}
                                          inputProps={{
                                            'aria-labelledby': labelId
                                          }}
                                          onClick={(event) => handleClick(event, row[idKey])}
                                        />
                                      )}
                                    </TableCell>
                                  )}

                                  {columns.map(({ dataKey, render, align, linkPath, length, rowCellProps, options }, colIdx) => {
                                    const finalLength = length || cellLength
                                    let value = row[dataKey]
                                    let shortValue = value
                                    if (typeof value === 'string') {
                                      const texts = multiLineText(value, finalLength)
                                      if (cellOverFlow === 'tooltip') {
                                        shortValue = texts[0]
                                      } else if (cellOverFlow === 'wrap') {
                                        shortValue = texts.join('\n')
                                      }
                                    }
                                    const finalValue = typeof render === 'function' ? render(value, shortValue) : shortValue
                                    return (
                                      <TableCell
                                        className={clsx(
                                          {
                                            [classes.link]: typeof linkPath === 'function',
                                            [classes.rowCell]: true
                                          },
                                          options?.className
                                        )}
                                        component={colIdx === 0 ? 'th' : undefined}
                                        scope={colIdx === 0 ? 'row' : undefined}
                                        padding={selectable && colIdx === 0 ? 'none' : 'default'}
                                        key={`${rowIdx}-${colIdx}`}
                                        align={align}
                                        onClick={() => (typeof linkPath === 'function' ? linkPath(row, dataKey) : null)}
                                        {...rowCellProps}
                                      >
                                        {cellOverFlow === 'tooltip' && value !== shortValue && (
                                          <Tooltip title={value}>
                                            <span>{finalValue}...</span>
                                          </Tooltip>
                                        )}
                                        {!(cellOverFlow === 'tooltip' && value !== shortValue) && finalValue}
                                      </TableCell>
                                    )
                                  })}
                                </TableRow>
                              )
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={columns.length}>
                                <Typography className={classes.emptyMessage}>No matching records found!</Typography>
                              </TableCell>
                            </TableRow>
                          )
                        ) : null}
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
                                        validate,
                                        disabled: disabledFunc
                                      },
                                      colIdx
                                    ) => {
                                      const row = fields?.value[rowIdx]
                                      const disabled = typeof disabledFunc === 'function' ? disabledFunc(row, dataKey) : options?.disabled

                                      const element = disabled && disabledElement === 'field' ? 'text-field' : inputType

                                      return (
                                        <TableCell
                                          className={clsx({
                                            [classes.rowCell]: element === 'text-field',
                                            [classes.inputPadding]: element !== 'text-field'
                                          })}
                                          key={`${rowIdx}-${colIdx}`}
                                          align={align}
                                          {...rowCellProps}
                                        >
                                          {element === 'text-field' && <TextField name={`${name}.${dataKey}`} render={render} options={options} />}
                                          {element === 'text-input' && (
                                            <TextInput
                                              name={`${name}.${dataKey}`}
                                              validate={validate}
                                              disabled={disabled}
                                              variant={variant}
                                              fontSize={fontSize}
                                              options={options}
                                            />
                                          )}
                                          {element === 'select-input' && (
                                            <SelectInput
                                              name={`${name}.${dataKey}`}
                                              choices={choices}
                                              validate={validate}
                                              disabled={disabled}
                                              variant={variant}
                                              fontSize={fontSize}
                                              options={options}
                                            />
                                          )}
                                          {element === 'boolean-input' && (
                                            <BooleanInput name={`${name}.${dataKey}`} disabled={disabled} options={options} />
                                          )}
                                        </TableCell>
                                      )
                                    }
                                  )}
                                </TableRow>
                              ))
                            }
                          </FieldArray>
                        )}
                      </TableBody>
                    </Table>
                  </PerfectScrollbar>
                </TableContainer>

                <div className={clsx(classes.footerContainer)}>
                  {editable && (
                    <div className={classes.footerActions}>
                      {!editing && (
                        <Button variant='text' color='primary' onClick={() => setEditing(true)} disabled={selected.length > 0}>
                          Edit
                        </Button>
                      )}
                      {editing && (
                        <React.Fragment>
                          <Button variant='text' color='primary' type='submit' disabled={submitting || pristine}>
                            Save
                          </Button>
                          <Button style={{ marginLeft: '1em' }} variant='text' onClick={() => setEditing(false)}>
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
                      count={rowList.length}
                      rowsPerPage={pageSize}
                      page={page}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangePageSize}
                      labelRowsPerPage='Page Size'
                      nextIconButtonProps={{
                        disabled: editing || totalPage === 0 || page === totalPage - 1
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
      inputType: PropTypes.oneOf(['text-field', 'text-input', 'select-input', 'boolean-input', 'date-input', 'auto-complete-input']),
      // when inputType is 'select' or 'auto-complete'
      choices: PropTypes.oneOfType([PropTypes.arrayOf(OptionType), PropTypes.func]),
      render: PropTypes.func, // (value, shortValue) => ?any
      disabled: PropTypes.func, // (row, dataKey) => boolean . If any normal cell has to disabled conditionally. It will have higher priority than disabled in options
      align: PropTypes.oneOf(['center', 'inherit', 'justify', 'left', 'right']),
      validate: PropTypes.func, // Validation function for TextInput and SelectInput
      filterOptions: PropTypes.shape({
        filter: PropTypes.bool,
        multiSelect: PropTypes.bool,
        showValueOnly: PropTypes.bool
      }),
      options: PropTypes.object, // options to be passed to underllying editable component - Input, Select, Switch etc
      length: PropTypes.number, // Cell Length. If not provided then cellLength value of table will be used.
      headerCellProps: PropTypes.object,
      rowCellProps: PropTypes.object
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  toolbar: PropTypes.bool,
  toolbarDivider: PropTypes.bool,
  editable: PropTypes.bool,
  selectable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]), // boolean | (row) => boolean
  selectAll: PropTypes.bool,
  sortable: PropTypes.bool,
  pageable: PropTypes.bool,
  tableProps: PropTypes.object,
  pageSize: PropTypes.oneOf([10, 25]),
  idKey: PropTypes.string, // Identifier Key in row object. This is used which selection
  selectActions: PropTypes.arrayOf(PropTypes.oneOf(['add', 'delete', 'edit'])),
  toolbarActions: PropTypes.arrayOf(PropTypes.oneOf(['search', 'column', 'filter'])),
  disabledElement: PropTypes.oneOf(['input', 'field']),
  cellLength: PropTypes.number,
  cellOverFlow: PropTypes.oneOf(['tooltip', 'wrap']),
  variant: PropTypes.oneOf(['default', 'excel']),
  fontSize: PropTypes.number,

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
  toolbarDivider: true,
  editable: false,
  selectable: false,
  selectAll: true,
  sortable: false,
  pageable: false,
  idKey: 'id',
  pageSize: 10,
  selectActions: ['delete'],
  disabledElement: 'input',
  cellLength: 30,
  cellOverFlow: 'tooltip',
  variant: 'default',
  fontSize: 12,
  onSubmit: () => {},
  comparator: (a, b) => 0
}

export default MuiTable
