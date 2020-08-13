import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

// final-form
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { Form, FormSpy } from 'react-final-form'

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
import IconButton from '@material-ui/core/IconButton'

// material-ui/icons
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add'
import LibraryAddIcon from '@material-ui/icons/LibraryAdd'
import DoneIcon from '@material-ui/icons/Done'
import CancelIcon from '@material-ui/icons/Clear'
import ChevronRight from '@material-ui/icons/KeyboardArrowRight'
import ChevronDown from '@material-ui/icons/KeyboardArrowDown'

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

import { multiLineText, getDistinctValues, capitalize } from './utils/helper'
import useMuiTable from './hooks/useMuiTable'

const getTooltip = (tooltip, action) => tooltip || capitalize(action)

const renderActions = ({ row, rowIdx, eRowIdx, inlineActions = [], actionPlacement, handleInlineActionClick }) => {
  const editing = !(eRowIdx === undefined || eRowIdx === null)
  const activeRow = eRowIdx === rowIdx
  const activeActions =
    actionPlacement === 'left' ? [{ name: 'cancel' }, { name: 'done', tooltip: 'Submit' }] : [{ name: 'done', tooltip: 'Submit' }, { name: 'cancel' }]
  return (
    <TableCell align={actionPlacement} padding='none'>
      {editing && activeRow
        ? activeActions.map(({ name, tooltip }, idx) => (
            <Tooltip key={idx} title={getTooltip(tooltip, name)} arrow>
              <IconButton aria-label={getTooltip(tooltip, name)} onClick={(e) => handleInlineActionClick(e, name, row, rowIdx)}>
                {name === 'done' && <DoneIcon fontSize='small' />}
                {name === 'cancel' && <CancelIcon fontSize='small' />}
              </IconButton>
            </Tooltip>
          ))
        : inlineActions.map(({ name, tooltip, icon }, idx) => (
            <Tooltip key={idx} title={getTooltip(tooltip, name)} arrow>
              <span>
                <IconButton aria-label={getTooltip(tooltip, name)} disabled={editing} onClick={(e) => handleInlineActionClick(e, name, row, rowIdx)}>
                  {name === 'add' && <AddIcon fontSize='small' />}
                  {name === 'duplicate' && <LibraryAddIcon fontSize='small' />}
                  {name === 'edit' && <EditIcon fontSize='small' />}
                  {name === 'delete' && <DeleteIcon fontSize='small' />}
                  {!['add', 'duplicate', 'edit', 'delete'].includes(name) && icon}
                </IconButton>
              </span>
            </Tooltip>
          ))}
    </TableCell>
  )
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
  disabledRow: {
    opacity: 0.2,
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  },
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
  const isTreeTable = props?.rows.filter((row) => Object.prototype.hasOwnProperty.call(row, props.parentIdKey)).length > 0 // Check Whether idKey exists in rows

  const {
    columns,
    rows,
    editable,
    enableRowAddition,
    selectAll,
    selectActions,
    inlineActions,
    actionPlacement,
    toolbar,
    toolbarDivider,
    title,
    tableProps,
    idKey,
    disabledElement,
    cellLength,
    cellOverFlow,
    expandedColor,
    childIndent,
    variant,
    fontSize,
    emptyMessage,
    rowAddCount,
    validate,
    onToolbarActionClick
  } = props

  // Disable these features in Tree Table
  const searchable = props.searchable && !isTreeTable
  const selectable = props.selectable && !isTreeTable
  const sortable = props.sortable && !isTreeTable
  const pageable = props.pageable && !isTreeTable

  const {
    rowList,
    key,
    editableInline,
    editableState,
    page,
    pageSize,
    totalPage,
    totalElements,
    selected,
    order,
    orderBy,
    filterValues,
    expanded,
    setSearchText,
    setEditableState,
    handleSelectActionClick,
    handleSubmit,
    handleInlineActionClick,
    handleRequestSort,
    updateFilter,
    resetFilter,
    removeFilter,
    handleSelectAllClick,
    handleClick,
    handleChangePage,
    handleChangePageSize,
    handleRowAdd,
    handleTreeExpand
  } = useMuiTable({ ...props, searchable, selectable, pageable, sortable })

  const classes = useStyles({ variant, pageable, editable, fontSize })

  const isSelected = (id) => selected.indexOf(id) !== -1

  const initialValues = {
    rows:
      rowList.length > 0
        ? rowList
        : Array(rowAddCount)
            .fill('')
            .map(() => ({}))
  }

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

  let toolbarActions = []
  if (searchable) {
    toolbarActions.push({ name: 'search' })
  }
  toolbarActions = toolbarActions.concat(props.toolbarActions)
  if (filterColumns.length > 0 && !isTreeTable) {
    toolbarActions.push({ name: 'filter' })
  }

  const showToolbar = toolbar || selected.length > 0 || searchable || filterColumns.length > 0
  // when actions are provided and not in colletive editing mode. (i.e - hide actions in collective editing mode)
  const showActions = inlineActions.length > 0 && (!editableState.editing || !(editableState.rowIdx === undefined || editableState.rowIdx == null))

  let footerActions = pageable ? ['save', 'row-add', 'cancel'] : ['cancel', 'row-add', 'save']
  if (!enableRowAddition) {
    footerActions = footerActions.filter((e) => e !== 'row-add')
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
                {showToolbar && (
                  <Toolbar
                    title={title}
                    selectedCount={selectedCount}
                    selectActions={selectActions}
                    toolbarActions={toolbarActions}
                    filterProps={filterProps}
                    onSearch={setSearchText}
                    onSelectActionClick={handleSelectActionClick}
                    onToolbarActionClick={onToolbarActionClick}
                  />
                )}

                <FilterList data={filterList} removeFilter={removeFilter} />

                {showToolbar && toolbarDivider && (variant !== 'excel' || !editableState.editing) && <Divider light />}

                <TableContainer>
                  <PerfectScrollbar>
                    <Table
                      className={clsx(
                        { [classes.table]: true, [classes.excelTable]: variant === 'excel' && editableState.editing },
                        tableProps?.className
                      )}
                      {...tableProps}
                    >
                      <TableHead
                        editing={editableState.editing}
                        selectable={selectable}
                        selectAll={selectAll}
                        sortable={sortable}
                        isTreeTable={isTreeTable}
                        columns={columns}
                        classes={classes}
                        selectedCount={selectedCount}
                        order={order}
                        orderBy={orderBy}
                        rowCount={rows.length}
                        showActions={showActions}
                        actionPlacement={actionPlacement}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                      />

                      <TableBody>
                        {!editableState.editing ? (
                          rowList.length > 0 ? (
                            rowList.map((row, rowIdx) => {
                              const isItemSelected = isSelected(row[idKey])
                              const labelId = `enhanced-table-checkbox-${rowIdx}`
                              const selectDisabled = typeof selectable === 'function' && !selectable(row)
                              return (
                                <TableRow
                                  hover
                                  role='checkbox'
                                  aria-checked={isItemSelected}
                                  tabIndex={-1}
                                  key={rowIdx}
                                  selected={isItemSelected}
                                  style={{
                                    backgroundColor: isTreeTable && row?.children?.length > 0 && expanded[row[idKey]] ? expandedColor : undefined
                                  }}
                                >
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
                                  {isTreeTable && (
                                    <TableCell padding='checkbox'>
                                      {row?.children?.length > 0 ? (
                                        <div
                                          style={{ paddingLeft: 8 * row.level, display: 'flex', alignItems: 'center' }}
                                          onClick={(event) => handleTreeExpand(event, row, expanded[row[idKey]])}
                                        >
                                          {expanded[row[idKey]] && <ChevronDown style={{ color: '#65819D' }} />}
                                          {!expanded[row[idKey]] && <ChevronRight style={{ color: '#65819D' }} />}
                                        </div>
                                      ) : null}
                                    </TableCell>
                                  )}

                                  {showActions && actionPlacement === 'left'
                                    ? renderActions({
                                        row,
                                        rowIdx,
                                        eRowIdx: editableState.rowIdx,
                                        inlineActions,
                                        actionPlacement,
                                        handleInlineActionClick
                                      })
                                    : null}

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
                                        style={{
                                          paddingLeft: isTreeTable && colIdx === 0 ? childIndent * (row.level + 1) : undefined
                                        }}
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

                                  {showActions && actionPlacement === 'right'
                                    ? renderActions({
                                        row,
                                        rowIdx,
                                        eRowIdx: editableState.rowIdx,
                                        inlineActions,
                                        actionPlacement,
                                        handleInlineActionClick
                                      })
                                    : null}
                                </TableRow>
                              )
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={columns.length}>
                                <Typography className={classes.emptyMessage}>
                                  {rows?.length === 0 ? emptyMessage : 'No matching records found!'}{' '}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )
                        ) : null}

                        {(editable || editableInline) && editableState.editing && (
                          <FieldArray name='rows'>
                            {({ fields }) =>
                              fields.map((name, rowIdx) => {
                                const row = fields?.value[rowIdx]
                                return (
                                  <TableRow
                                    key={rowIdx}
                                    className={clsx({
                                      [classes.disabledRow]:
                                        editableState.rowIdx !== undefined && (editableState.rowIdx !== null) & (rowIdx !== editableState.rowIdx)
                                    })}
                                  >
                                    {showActions && actionPlacement === 'left'
                                      ? renderActions({
                                          row,
                                          rowIdx,
                                          eRowIdx: editableState.rowIdx,
                                          inlineActions,
                                          actionPlacement,
                                          handleInlineActionClick
                                        })
                                      : null}
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
                                          length,
                                          disabled: disabledFunc
                                        },
                                        colIdx
                                      ) => {
                                        const disabled = typeof disabledFunc === 'function' ? disabledFunc(row, dataKey) : options?.disabled

                                        let element = disabled && disabledElement === 'field' ? 'text-field' : inputType
                                        if (editableState.rowIdx !== undefined && editableState.rowIdx !== rowIdx) {
                                          element = 'text-field'
                                        }
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
                                            {element === 'text-field' && (
                                              <TextField
                                                name={`${name}.${dataKey}`}
                                                render={render}
                                                cellOverFlow={cellOverFlow}
                                                cellLength={cellLength}
                                                length={length}
                                                options={options}
                                              />
                                            )}
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
                                    {showActions && actionPlacement === 'right'
                                      ? renderActions({
                                          row,
                                          rowIdx,
                                          eRowIdx: editableState.rowIdx,
                                          inlineActions,
                                          actionPlacement,
                                          handleInlineActionClick
                                        })
                                      : null}
                                  </TableRow>
                                )
                              })
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
                      {editableState.editing ? (
                        <FormSpy subscription={{ form: true }}>
                          {({ form }) =>
                            footerActions.map((action) =>
                              action === 'save' ? (
                                <Button key={action} variant='text' color='primary' type='submit' disabled={submitting || pristine}>
                                  Save
                                </Button>
                              ) : action === 'row-add' ? (
                                <Button key={action} style={{ marginLeft: '1em' }} variant='text' onClick={() => handleRowAdd(form)}>
                                  Add Rows
                                </Button>
                              ) : action === 'cancel' ? (
                                <Button
                                  key={action}
                                  style={{ marginLeft: '1em' }}
                                  variant='text'
                                  onClick={() => setEditableState({ editing: false })}
                                >
                                  Cancel
                                </Button>
                              ) : null
                            )
                          }
                        </FormSpy>
                      ) : (
                        <Button variant='text' color='primary' onClick={() => setEditableState({ editing: true })} disabled={selected.length > 0}>
                          Edit
                        </Button>
                      )}
                    </div>
                  )}

                  {pageable && (
                    <TablePagination
                      rowsPerPageOptions={[10, 25]}
                      component='div'
                      count={totalElements}
                      rowsPerPage={pageSize}
                      page={page}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangePageSize}
                      labelRowsPerPage='Page Size'
                      nextIconButtonProps={{
                        disabled: editableState.editing || totalPage === 0 || page === totalPage - 1
                      }}
                      backIconButtonProps={{ disabled: editableState.editing || page === 0 }}
                      SelectProps={{
                        disabled: editableState.editing
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

const ActionType = PropTypes.shape({
  name: PropTypes.string,
  tooltip: PropTypes.string,
  icon: PropTypes.any
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
  enableRowAddition: PropTypes.bool, // Whether row addition should be enabled in editable mode.
  searchable: PropTypes.bool,
  searchKeys: PropTypes.arrayOf(PropTypes.string),
  selectable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]), // boolean | (row) => boolean
  selectAll: PropTypes.bool,
  sortable: PropTypes.bool,
  pageable: PropTypes.bool,
  tableProps: PropTypes.object,
  pageSize: PropTypes.oneOf([10, 25]),
  idKey: PropTypes.string, // Identifier Key in row object. This is used for selection and in tree table
  parentIdKey: PropTypes.string, // Identifier Key of parent in row object. This is used in tree table
  selectActions: PropTypes.arrayOf(ActionType), // standard actions - add, delete, edit
  toolbarActions: PropTypes.arrayOf(ActionType), // standard actions - column
  inlineActions: PropTypes.arrayOf(ActionType), // standard actions - edit, delete, add, duplicate
  actionPlacement: PropTypes.oneOf(['left', 'right']),
  rowInsert: PropTypes.oneOf(['above', 'below']), // row should be inserted above or below for inline - add/duplicate actions
  disabledElement: PropTypes.oneOf(['input', 'field']),
  cellLength: PropTypes.number,
  cellOverFlow: PropTypes.oneOf(['tooltip', 'wrap']),
  variant: PropTypes.oneOf(['default', 'excel']),
  fontSize: PropTypes.number,
  emptyMessage: PropTypes.string,
  rowAddCount: PropTypes.number, // Number of rows to add in editable mode
  expandedColor: PropTypes.string,
  childIndent: PropTypes.number,
  initialExpandedState: PropTypes.object, // {[idKey]: bool} - Initial expanded state

  validate: PropTypes.func, // (values: FormValues) => Object | Promise<Object>
  onSubmit: PropTypes.func,
  onSelectActionClick: PropTypes.func, // (event, action, rows, onActionComplete) => void
  onToolbarActionClick: PropTypes.func, // (event, action) => void
  onInlineActionClick: PropTypes.func, // (event, action, row, onActionComplete) => void
  onTreeExapand: PropTypes.func, // (event, row, isExpanded) => any
  defaultExpanded: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]), // bool | (row, level) => bool
  comparator: PropTypes.func,
  hasRowsChanged: PropTypes.func // (rows) => Key: String Function to detect whether rows props has changed
}

MuiTable.defaultProps = {
  columns: [],
  rows: [],
  title: 'Mui Table',
  toolbar: false,
  toolbarDivider: true,
  searchable: false,
  searchKeys: ['name'],
  editable: false,
  enableRowAddition: false,
  selectable: false,
  selectAll: true,
  sortable: false,
  pageable: false,
  idKey: 'id',
  parentIdKey: 'parentId',
  pageSize: 10,
  selectActions: [{ name: 'delete' }],
  toolbarActions: [],
  inlineActions: [],
  actionPlacement: 'right',
  rowInsert: 'below',
  disabledElement: 'input',
  cellLength: 30,
  cellOverFlow: 'tooltip',
  variant: 'default',
  fontSize: 12,
  emptyMessage: 'No records available!',
  rowAddCount: 3,
  initialExpandedState: null,
  defaultExpanded: false,
  childIndent: 12,
  expandedColor: 'none',
  onSubmit: () => {},
  comparator: (a, b) => 0,
  hasRowsChanged: (rows) => `${rows?.length}`
}

export default MuiTable
