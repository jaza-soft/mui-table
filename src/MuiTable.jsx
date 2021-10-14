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

import { multiLineText, getDistinctValues, nameFromId, mergeArray, getLabel, capitalize } from './utils/helper'
import translate from './utils/translate'
import useMuiTable from './hooks/useMuiTable'
import { composeValidators } from './utils/validators'

const renderActions = ({
  showActions,
  totalRowKey,
  row,
  rowIdx,
  eRowIdx,
  inlineActions = [],
  editingInline,
  actionPlacement,
  hasValidationErrors,
  handleInlineActionClick,
  i18nMap
}) => {
  const showEmpty = !showActions || row[totalRowKey]
  if (showEmpty) {
    return <TableCell align={actionPlacement} padding='none' />
  }
  const activeRow = eRowIdx === rowIdx
  const activeActions =
    actionPlacement === 'left' ? [{ name: 'cancel' }, { name: 'done', tooltip: 'Submit' }] : [{ name: 'done', tooltip: 'Submit' }, { name: 'cancel' }]
  return (
    <TableCell align={actionPlacement} padding='none'>
      {editingInline && activeRow
        ? activeActions.map(({ name, tooltip }, idx) => (
            <Tooltip key={idx} title={getLabel(`inlineAction.${name}`, tooltip, i18nMap, { _: capitalize(name) })} arrow>
              <IconButton
                aria-label={getLabel(`inlineAction.${name}`, tooltip, i18nMap, { _: capitalize(name) })}
                onClick={(e) => handleInlineActionClick(e, name, row, rowIdx, hasValidationErrors)}
              >
                {name === 'done' && <DoneIcon fontSize='small' />}
                {name === 'cancel' && <CancelIcon fontSize='small' />}
              </IconButton>
            </Tooltip>
          ))
        : inlineActions.map(({ name, tooltip, icon, options }, idx) => (
            <Tooltip key={idx} title={getLabel(`inlineAction.${name}`, tooltip, i18nMap, { _: capitalize(name) })} arrow>
              <span>
                <IconButton
                  aria-label={getLabel(`inlineAction.${name}`, tooltip, i18nMap, { _: capitalize(name) })}
                  disabled={editingInline}
                  onClick={(e) => handleInlineActionClick(e, name, row, rowIdx)}
                  {...options}
                >
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

const renderEditableActions = ({ fields, row, rowIdx, actions = [], actionPlacement, handleEditableActionClick, i18nMap }) => {
  return (
    <TableCell align={actionPlacement} padding='none'>
      {actions.map(({ name, tooltip, options }, idx) => (
        <Tooltip key={idx} title={getLabel(`inlineAction.${name}`, tooltip, i18nMap, { _: capitalize(name) })} arrow>
          <span>
            <IconButton
              aria-label={getLabel(`inlineAction.${name}`, tooltip, i18nMap, { _: capitalize(name) })}
              disabled={row?.hasChild && name === 'delete'}
              onClick={(e) => handleEditableActionClick(e, name, fields, row, rowIdx)}
              {...options}
            >
              {name === 'add' && <AddIcon fontSize='small' />}
              {name === 'addChild' && <LibraryAddIcon fontSize='small' />}
              {name === 'delete' && <DeleteIcon fontSize='small' />}
            </IconButton>
          </span>
        </Tooltip>
      ))}
    </TableCell>
  )
}

const FormContent = (props) => {
  const {
    classes,
    toolbarStyle,
    i18nMap,
    columns,
    rows,
    rowList,
    submitting,
    hasValidationErrors,
    showToolbar,
    title,
    selectActions,
    toolbarActions,
    filterProps,
    searchFocus,
    searchText,
    setSearchText,
    setSearchFocus,
    handleSelectActionClick,
    onToolbarActionClick,
    filterList,
    removeFilter,
    chipOptions,
    toolbarDivider,
    variant,
    editableState,
    tableProps,
    selectable,
    selectAll,
    sortable,
    isTreeTable,
    order,
    orderBy,
    showActions,
    showEditableActions,
    actionPlacement,
    handleSelectAllClick,
    handleRequestSort,
    isSelected,
    expandedColor,
    idKey,
    rowStyle,
    totalRowKey,
    expanded,
    handleClick,
    handleTreeExpand,
    inlineActions,
    handleInlineActionClick,
    cellLength,
    cellOverFlow,
    cellStyle,
    childIndent,
    emptyMessage,
    editable,
    editableInline,
    editableActions,
    handleEditableActionClick,
    disabledElement,
    fontSize,
    editingFooterActions,
    viewFooterActions,
    selected,
    handleRowAdd,
    handleEditCancel,
    setEditableState,
    pageable,
    handleFooterActionClick,
    totalElements,
    pageSize,
    page,
    totalPage,
    handleChangePage,
    handleChangePageSize
  } = props

  const selectedCount = selected.length

  const editFooterActions =
    props.editing && props.handleSubmitRef ? editingFooterActions.filter((e) => !['save', 'cancel'].includes(e.name)) : editingFooterActions

  let footerElement = (
    <div className={clsx(classes.footerContainer)}>
      <div className={classes.footerActions}>
        {editableState.editing ? (
          <FormSpy subscription={{ form: true, values: true }}>
            {({ form, values }) =>
              editFooterActions
                .sort((a, b) => a.serialNo - b.serialNo)
                .map(({ name, tooltip }) =>
                  name === 'save' ? (
                    <Button key={name} className={classes.button} variant='text' color='primary' type='submit' disabled={submitting}>
                      {getLabel(`footerAction.${name}`, tooltip, i18nMap, { _: 'Save' })}
                    </Button>
                  ) : name === 'rowAdd' ? (
                    <Button key={name} className={classes.button} variant='text' onClick={() => handleRowAdd(form, values)}>
                      {getLabel(`footerAction.${name}`, tooltip, i18nMap, { _: 'Add Rows' })}
                    </Button>
                  ) : name === 'cancel' ? (
                    <Button key={name} className={classes.button} variant='text' onClick={handleEditCancel}>
                      {getLabel(`footerAction.${name}`, tooltip, i18nMap, { _: 'Cancel' })}
                    </Button>
                  ) : null
                )
            }
          </FormSpy>
        ) : !editableState.editingInline ? (
          viewFooterActions
            .sort((a, b) => a.serialNo - b.serialNo)
            .map(({ name, tooltip, icon, options }) => {
              const disabled = name === 'edit' ? selected.length > 0 : editableState.busy
              return (
                <Button
                  key={name}
                  className={classes.button}
                  variant='text'
                  onClick={(event) => (name === 'edit' ? setEditableState({ editing: true }) : handleFooterActionClick(event, name))}
                  disabled={disabled}
                  {...options}
                >
                  {icon}
                  {icon && <span style={{ padding: '0.25em' }} />}
                  {getLabel(`footerAction.${name}`, tooltip, i18nMap, { _: capitalize(name) })}
                </Button>
              )
            })
        ) : null}
      </div>

      {pageable && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component='div'
          count={totalElements}
          rowsPerPage={pageSize}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangePageSize}
          labelRowsPerPage={translate('text.pageSize', i18nMap, { _: 'Page Size' })}
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
  )
  if (editableState.editing && editFooterActions?.length === 0) {
    footerElement = null
  }

  return (
    <Paper>
      {showToolbar && (
        <Toolbar
          style={toolbarStyle}
          className={classes.toolbar}
          title={title}
          selectedCount={selectedCount}
          selectActions={selectActions}
          toolbarActions={toolbarActions}
          filterProps={filterProps}
          autoFocus={searchFocus}
          searchText={searchText}
          onSearch={setSearchText}
          onFocus={setSearchFocus}
          onSelectActionClick={handleSelectActionClick}
          onToolbarActionClick={onToolbarActionClick}
          i18nMap={i18nMap}
        />
      )}

      <FilterList data={filterList} removeFilter={removeFilter} chipOptions={chipOptions} />

      {showToolbar && toolbarDivider && (variant !== 'excel' || !editableState.editing) && <Divider light />}

      <TableContainer>
        <PerfectScrollbar>
          <Table
            className={clsx({ [classes.table]: true, [classes.excelTable]: variant === 'excel' && editableState.editing }, tableProps?.className)}
            {...tableProps}
          >
            <TableHead
              editing={editableState.editing || editableState.editingInline}
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
              showActions={showActions || (editableState.editing && showEditableActions)}
              actionPlacement={actionPlacement}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              i18nMap={i18nMap}
            />

            <TableBody>
              {!(editableState.editing || editableState.editingInline) ? (
                rowList.length > 0 ? (
                  rowList.map((row, rowIdx) => {
                    const isItemSelected = isSelected(row[idKey])
                    const labelId = `enhanced-table-checkbox-${rowIdx}`
                    const selectDisabled = typeof selectable === 'function' && !selectable(row)
                    const style = typeof rowStyle === 'function' ? rowStyle({ row, rowIdx }) : rowStyle
                    const bgColor = Array.isArray(expandedColor) ? expandedColor[row?.level] : expandedColor
                    let fontWeight = 'normal'
                    if (row[totalRowKey]) {
                      fontWeight = 'bold'
                    }
                    return (
                      <TableRow
                        hover
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={rowIdx}
                        selected={isItemSelected}
                        style={{
                          backgroundColor: isTreeTable && row?.hasChild && expanded[row[idKey]] ? bgColor : undefined,
                          ...style
                        }}
                      >
                        {!!selectable && (
                          <TableCell padding='checkbox'>
                            {!selectDisabled && !row[totalRowKey] && (
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
                            {row?.hasChild ? (
                              <div
                                style={{ paddingLeft: 8 * (row?.level || 0), display: 'flex', alignItems: 'center' }}
                                onClick={(event) => handleTreeExpand(event, row, expanded[row[idKey]])}
                              >
                                {expanded[row[idKey]] && <ChevronDown style={{ color: '#65819D' }} />}
                                {!expanded[row[idKey]] && <ChevronRight style={{ color: '#65819D' }} />}
                              </div>
                            ) : null}
                          </TableCell>
                        )}

                        {actionPlacement === 'left'
                          ? renderActions({
                              showActions,
                              totalRowKey,
                              row,
                              rowIdx,
                              eRowIdx: editableState.rowIdx,
                              inlineActions,
                              editingInline: editableState.editingInline,
                              actionPlacement,
                              handleInlineActionClick,
                              i18nMap
                            })
                          : null}

                        {columns.map((column, colIdx) => {
                          const { dataKey, render, align, linkPath, length, rowCellProps, options } = column
                          const finalLength = length || cellLength
                          const value = row[dataKey]
                          let shortValue = value
                          if (typeof value === 'string') {
                            const texts = multiLineText(value, finalLength)
                            if (cellOverFlow === 'tooltip') {
                              shortValue = texts[0]
                            } else if (cellOverFlow === 'wrap') {
                              shortValue = texts.join('\n')
                            }
                          }
                          const finalValue = typeof render === 'function' ? render(value, shortValue, row) : shortValue
                          const style = typeof cellStyle === 'function' ? cellStyle({ row, rowIdx, column, colIdx }) : {}
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
                              style={{
                                fontWeight,
                                paddingLeft: isTreeTable && colIdx === 0 ? childIndent * (row?.level ? row.level + 1 : 1) : undefined,
                                ...style,
                                ...rowCellProps?.style
                              }}
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

                        {actionPlacement === 'right'
                          ? renderActions({
                              showActions,
                              totalRowKey,
                              row,
                              rowIdx,
                              eRowIdx: editableState.rowIdx,
                              inlineActions,
                              editingInline: editableState.editingInline,
                              actionPlacement,
                              handleInlineActionClick,
                              i18nMap
                            })
                          : null}
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + (showActions || (editableState.editing && showEditableActions) ? 1 : 0)}>
                      <Typography className={classes.emptyMessage}>{rows?.length === 0 ? emptyMessage : 'No matching records found!'} </Typography>
                    </TableCell>
                  </TableRow>
                )
              ) : null}

              {(editable || editableInline) && (editableState.editing || editableState.editingInline) && (
                <FieldArray name='rows'>
                  {({ fields }) =>
                    fields.map((name, rowIdx) => {
                      const row = fields?.value[rowIdx]
                      return (
                        <TableRow
                          key={rowIdx}
                          className={clsx({
                            [classes.disabledRow]: editableState.editableInline && rowIdx !== editableState.rowIdx
                          })}
                        >
                          {actionPlacement === 'left' && editableState.editingInline
                            ? renderActions({
                                showActions,
                                totalRowKey,
                                row,
                                rowIdx,
                                eRowIdx: editableState.rowIdx,
                                inlineActions,
                                editingInline: editableState.editingInline,
                                actionPlacement,
                                hasValidationErrors,
                                handleInlineActionClick,
                                i18nMap
                              })
                            : null}

                          {showEditableActions && actionPlacement === 'left'
                            ? renderEditableActions({
                                fields,
                                row,
                                rowIdx,
                                actions: editableActions,
                                actionPlacement,
                                handleEditableActionClick,
                                i18nMap
                              })
                            : null}
                          {isTreeTable && (
                            <TableCell padding='checkbox'>
                              {row?.hasChild ? (
                                <div style={{ paddingLeft: 8 * (row?.level || 0), display: 'flex', alignItems: 'center' }}>
                                  <ChevronDown style={{ color: '#65819D' }} />
                                </div>
                              ) : null}
                            </TableCell>
                          )}

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
                              if (editableState.editingInline && editableState.rowIdx !== rowIdx) {
                                element = 'text-field'
                              }
                              const finalChoices = typeof choices === 'function' ? choices({ row, rowIdx, colIdx, dataKey }) : choices
                              return (
                                <TableCell
                                  className={clsx({
                                    [classes.rowCell]: element === 'text-field',
                                    [classes.inputPadding]: element !== 'text-field'
                                  })}
                                  key={`${rowIdx}-${colIdx}`}
                                  align={align}
                                  style={{
                                    paddingLeft: isTreeTable && colIdx === 0 ? childIndent * (row?.level ? row.level + 1 : 1) : undefined
                                  }}
                                  {...rowCellProps}
                                >
                                  {element === 'text-field' && (
                                    <TextField
                                      name={`${name}.${dataKey}`}
                                      row={row}
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
                                      i18nMap={i18nMap}
                                      options={options}
                                    />
                                  )}
                                  {element === 'select-input' && (
                                    <SelectInput
                                      name={`${name}.${dataKey}`}
                                      choices={finalChoices}
                                      validate={validate}
                                      disabled={disabled}
                                      variant={variant}
                                      fontSize={fontSize}
                                      i18nMap={i18nMap}
                                      options={options}
                                    />
                                  )}
                                  {element === 'boolean-input' && <BooleanInput name={`${name}.${dataKey}`} disabled={disabled} options={options} />}
                                </TableCell>
                              )
                            }
                          )}
                          {actionPlacement === 'right' && editableState.editingInline
                            ? renderActions({
                                showActions,
                                totalRowKey,
                                row,
                                rowIdx,
                                eRowIdx: editableState.rowIdx,
                                inlineActions,
                                editingInline: editableState.editingInline,
                                actionPlacement,
                                hasValidationErrors,
                                handleInlineActionClick,
                                i18nMap
                              })
                            : null}
                          {showEditableActions && actionPlacement === 'right'
                            ? renderEditableActions({
                                fields,
                                row,
                                rowIdx,
                                actions: editableActions,
                                actionPlacement,
                                handleEditableActionClick,
                                i18nMap
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

      {footerElement}
    </Paper>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    minWidth: 650,
    whiteSpace: 'pre'
  },
  toolbar: {},
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
    justifyContent: props.pageable ? 'space-between' : 'flex-end'
  }),
  footerActions: (props) => ({
    padding: props.editable || props.footerActions?.length > 0 ? '0.5em 1em' : undefined
  }),
  button: {
    margin: '0 0.5em'
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

  const { rows, editable, enableRowAddition, inlineActions, footerActions, toolbar, totalRowKey, variant, fontSize, rowAddCount, validate } = props

  const columns = props.columns?.map((c) => ({ ...c, validate: Array.isArray(c.validate) ? composeValidators(c.validate) : c.validate }))

  // Disable these features in Tree Table
  const searchable = isTreeTable ? false : props.searchable
  const selectable = isTreeTable ? false : props.selectable
  const sortable = isTreeTable ? false : props.sortable
  const pageable = isTreeTable ? false : props.pageable

  const { rowList, key, updateFilter, resetFilter, editableState, selected, filterValues, handleSubmit, i18nMap, ...restProps } = useMuiTable({
    ...props,
    searchable,
    selectable,
    pageable,
    sortable
  })

  const classes = useStyles({ variant, pageable, editable, fontSize, footerActions })

  const isSelected = (id) => selected.indexOf(id) !== -1

  const filterColumns = columns
    .filter((c) => c.filterOptions?.filter)
    .map((c) => {
      const distinctValues = getDistinctValues(rows.map((row) => row[c.dataKey]).filter((e) => typeof e === 'string' || typeof e === 'number'))
      const choices = distinctValues.map((value) => ({
        id: value,
        name: nameFromId(c, rows, value)
      }))
      return {
        dataKey: c.dataKey,
        title: c.title,
        multiSelect: c.filterOptions?.multiSelect,
        choices
      }
    })

  const filterList = Object.keys(filterValues).flatMap((dataKey) => {
    let result = []
    const value = filterValues[dataKey]
    const column = columns.find((c) => c.dataKey === dataKey) || {}
    if (Array.isArray(value)) {
      result = value.map((v) => ({
        dataKey,
        title: column?.title,
        value: v,
        name: nameFromId(column, rows, v),
        showValueOnly: column?.filterOptions?.showValueOnly
      }))
    } else {
      result = [{ dataKey, title: column?.title, value, name: nameFromId(column, rows, value), showValueOnly: column?.filterOptions?.showValueOnly }]
    }
    return result
  })

  const filterProps = {
    columns: filterColumns,
    filterValues,
    updateFilter,
    resetFilter,
    i18nMap
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
  const showActions = inlineActions.length > 0 && !editableState.editing

  // footer actions in editable mode
  let editingFooterActions = [
    { name: 'save', serialNo: pageable ? 1 : -1 },
    { name: 'rowAdd', serialNo: pageable ? 2 : -2 },
    { name: 'cancel', serialNo: pageable ? 3 : -3 }
  ]
  if (!enableRowAddition) {
    editingFooterActions = editingFooterActions.filter((e) => e?.name !== 'rowAdd')
  }
  // footer actions in view mode
  let viewFooterActions = mergeArray(
    [{ name: 'edit', tooltip: 'Edit', options: { color: 'primary' }, serialNo: pageable ? 1 : -1 }],
    footerActions,
    'name'
  )
  if (!editable) {
    viewFooterActions = viewFooterActions.filter((e) => e?.name !== 'edit')
  }
  // Inline Actions in Editable mode
  const editableActions = [
    { name: 'add', tooltip: 'Add Row' },
    { name: 'delete', tooltip: 'Remove Row' }
  ]
  if (isTreeTable) {
    editableActions.splice(1, 0, { name: 'addChild', tooltip: 'Add Child' })
  }

  const initialValues = React.useMemo(() => {
    return {
      rows:
        rowList.length > 0
          ? rowList.filter((row) => !row[totalRowKey])
          : Array(rowAddCount)
              .fill('')
              .map(() => ({}))
    }
  }, [JSON.stringify(rowList)])

  return (
    <div>
      <Form
        classes={classes.root}
        className={props.className}
        style={props.style}
        key={`${key}-${JSON.stringify(initialValues)}`}
        onSubmit={handleSubmit}
        validate={validate}
        validateOnBlur
        mutators={arrayMutators}
        subscription={{ submitting: true, hasValidationErrors: true }}
        initialValues={initialValues}
      >
        {({ handleSubmit, submitting, hasValidationErrors }) => {
          props.handleSubmitRef && props.handleSubmitRef(handleSubmit)
          return React.createElement(
            props.component,
            { onSubmit: handleSubmit },
            <FormContent
              {...props}
              {...restProps}
              classes={classes}
              submitting={submitting}
              hasValidationErrors={hasValidationErrors}
              columns={columns}
              rows={rows}
              rowList={rowList}
              isTreeTable={isTreeTable}
              editable={editable}
              pageable={pageable}
              inlineActions={inlineActions}
              editableActions={editableActions}
              toolbarActions={toolbarActions}
              viewFooterActions={viewFooterActions}
              editingFooterActions={editingFooterActions}
              showActions={showActions}
              showToolbar={showToolbar}
              filterProps={filterProps}
              filterList={filterList}
              editableState={editableState}
              selected={selected}
              isSelected={isSelected}
              totalRowKey={totalRowKey}
              variant={variant}
              fontSize={fontSize}
              i18nMap={i18nMap}
            />
          )
        }}
      </Form>
    </div>
  )
}

const OptionType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired
})

const ActionType = PropTypes.shape({
  serialNo: PropTypes.number,
  name: PropTypes.string,
  tooltip: PropTypes.string,
  icon: PropTypes.any,
  options: PropTypes.object
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
      validate: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]), // Validation function for TextInput and SelectInput
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
  pageSize: PropTypes.oneOf([5, 10, 25, 50]),
  idKey: PropTypes.string, // Identifier Key in row object. This is used for selection and in tree table
  totalRowKey: PropTypes.string, // For flaging a row as total row, set true value in totalRowKey
  parentIdKey: PropTypes.string, // Identifier Key of parent in row object. This is used in tree table
  selectActions: PropTypes.arrayOf(ActionType), // standard actions - add, delete, edit
  toolbarActions: PropTypes.arrayOf(ActionType), // standard actions - column
  inlineActions: PropTypes.arrayOf(ActionType), // standard actions - edit, delete, add, duplicate
  footerActions: PropTypes.arrayOf(ActionType), // standard actions - edit, save, rowAdd, cancel
  chipOptions: PropTypes.object,
  actionPlacement: PropTypes.oneOf(['left', 'right']),
  rowInsert: PropTypes.oneOf(['above', 'below']), // row should be inserted above or below for inline - add/duplicate actions
  disabledElement: PropTypes.oneOf(['input', 'field']),
  cellLength: PropTypes.number,
  cellOverFlow: PropTypes.oneOf(['tooltip', 'wrap']),
  variant: PropTypes.oneOf(['default', 'excel']),
  fontSize: PropTypes.number,
  emptyMessage: PropTypes.string,
  rowAddCount: PropTypes.number, // Number of rows to add in editable mode
  onRowAdd: PropTypes.func, // (rows) => row object
  expandedColor: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  childIndent: PropTypes.number,
  initialExpandedState: PropTypes.object, // {[idKey]: bool} - Initial expanded state
  showEditableActions: PropTypes.bool, // Show actions - (add, delete) in editable mode
  component: PropTypes.string, // HTML component to use for FormContent
  editing: PropTypes.bool, // To Open table in editable mode
  i18nMap: PropTypes.object, // i18n object containing key and values

  toolbarStyle: PropTypes.object,
  rowStyle: PropTypes.oneOfType([PropTypes.func, PropTypes.object]), // ({row, rowIdx}) => Object
  cellStyle: PropTypes.oneOfType([PropTypes.func, PropTypes.object]), // ({row, column, rowIdx, columnIdx}) => Object
  validate: PropTypes.func, // (values: FormValues) => Object | Promise<Object>
  onSubmit: PropTypes.func,
  onSelectActionClick: PropTypes.func, // (event, action, rows, onActionComplete) => void
  onToolbarActionClick: PropTypes.func, // (event, action) => void
  onInlineActionClick: PropTypes.func, // (event, action, row, onActionComplete) => void
  onFooterActionClick: PropTypes.func, // (event, action, rows, onActionComplete) => void
  onTreeExapand: PropTypes.func, // (event, row, isExpanded) => any
  defaultExpanded: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]), // bool | (row, level) => bool
  comparator: PropTypes.func,
  handleSubmitRef: PropTypes.func // When Form is submited externally, get hold of ReactFinalForm handleSubmit function by passing this function.
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
  totalRowKey: 'totalRow',
  parentIdKey: 'parentId',
  pageSize: 10,
  selectActions: [{ name: 'delete' }],
  toolbarActions: [],
  inlineActions: [],
  footerActions: [],
  chipOptions: {},
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
  showEditableActions: false,
  component: 'form',
  editing: false,
  rowStyle: {},
  cellStyle: {},
  onSubmit: () => {},
  comparator: (a, b) => 0
}

export default React.memo(MuiTable)
