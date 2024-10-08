import React, { useEffect, useState } from 'react'
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
import CircularProgress from '@material-ui/core/CircularProgress'

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
import FileInput from './components/FileInput'
import SelectInput from './components/SelectInput'
import BooleanInput from './components/BooleanInput'
import AutoCompleteInput from './components/AutoCompleteInput'

import { multiLineText, getDistinctValues, nameFromId, mergeArray, getLabel, capitalize, isEmpty, isPromise, truncate } from './utils/helper'
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

  const finalInlineActions = typeof inlineActions === 'function' ? inlineActions(row) : inlineActions

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
        : finalInlineActions.map(({ name, tooltip, icon, options }, idx) => (
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

const renderEditableActions = ({ fields, row, rowIdx, actions = [], actionPlacement, showChildAddAction, handleEditableActionClick, i18nMap }) => {
  const finalActions = actions.filter(
    (action) => action?.name !== 'addChild' || typeof showChildAddAction !== 'function' || showChildAddAction(row, fields?.value)
  )
  return (
    <TableCell align={actionPlacement} padding='none'>
      {finalActions.map(({ name, tooltip, options }, idx) => (
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
    headerCellStyle,
    i18nMap,
    columns,
    headerRows,
    rows,
    rowList,
    form,
    submitting,
    hasValidationErrors,
    showToolbar,
    title,
    titleSelected,
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
    showChildAddAction,
    actionPlacement,
    handleSelectAllClick,
    handleRequestSort,
    isSelected,
    expandedColor,
    idKey,
    rowStyle,
    totalRowKey,
    expanded,
    busy,
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
    choiceData,
    setChoiceData,
    handleRowAdd,
    handleEditCancel,
    pageable,
    handleFooterActionClick,
    totalElements,
    rowsPerPageOptions,
    pageSize,
    page,
    totalPage,
    handleChangePage,
    handleChangePageSize,
    handleOnChange,
    onRowClick
  } = props

  const selectedCount = selected.length
  const selectedRows = rows.filter((row) => selected.includes(row[idKey]))

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
                  onClick={(event) => handleFooterActionClick(event, name)}
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
          rowsPerPageOptions={rowsPerPageOptions}
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
          titleSelected={titleSelected}
          selectedCount={selectedCount}
          selectedRows={selectedRows}
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
              headerRows={headerRows}
              headerCellStyle={headerCellStyle}
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
                        key={`${rowIdx}-${JSON.stringify(style)}`}
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
                                {busy[row[idKey]] && <CircularProgress color='secondary' size={20} />}
                                {!busy[row[idKey]] && expanded[row[idKey]] && <ChevronDown style={{ color: '#65819D' }} />}
                                {!busy[row[idKey]] && !expanded[row[idKey]] && <ChevronRight style={{ color: '#65819D' }} />}
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

                        {columns
                          .filter((c) => isEmpty(c.hidden) || c.hidden === false)
                          .map((column, colIdx) => {
                            const { dataKey, render, align, linkPath, length, rowCellProps, options } = column
                            const finalLength = length || cellLength
                            const value = row[dataKey]
                            let shortValue = value
                            if (typeof value === 'string') {
                              const texts = multiLineText(value, finalLength)
                              if (cellOverFlow === 'tooltip') {
                                shortValue = truncate(texts[0], finalLength)
                              } else if (cellOverFlow === 'wrap') {
                                shortValue = texts.join('\n')
                              }
                            }

                            const style = typeof cellStyle === 'function' ? cellStyle({ row, rowIdx, column, colIdx }) : {}
                            let finalValue = typeof render === 'function' ? render(value, shortValue, row) : shortValue
                            if (Array.isArray(finalValue) && finalValue.some((e) => e instanceof File)) {
                              finalValue = finalValue.map((e) => e?.name || e).join(', ')
                            } else if (finalValue instanceof File) {
                              finalValue = finalValue?.name
                            }
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
                                onClick={() =>
                                  typeof linkPath === 'function' ? linkPath(row, dataKey) : typeof onRowClick === 'function' ? onRowClick(row) : null
                                }
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
                    <TableCell colSpan={columns.length + (showActions || !!selectable || (editableState.editing && showEditableActions) ? 1 : 0)}>
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
                                showChildAddAction,
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

                          {columns
                            .filter((c) => isEmpty(c.hidden) || c.hidden === false)
                            .map(
                              (
                                {
                                  dataKey,
                                  inputType = 'text-field',
                                  render,
                                  fetchChoices,
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
                                const disabled = typeof disabledFunc === 'function' ? disabledFunc(row, dataKey, fields?.value) : options?.disabled

                                const handleChoiceFetch = (searchText) => {
                                  if (typeof fetchChoices !== 'function') return
                                  const result = fetchChoices(searchText)
                                  if (isPromise(result)) {
                                    result.then((choiceList) => {
                                      if (Array.isArray(choiceList)) {
                                        const data = choiceList.reduce((acc, e) => ({ ...acc, [e.id]: e }), {})
                                        setChoiceData((prev) => ({ ...prev, [dataKey]: { ...prev[dataKey], ...data } }))
                                      }
                                    })
                                  }
                                }

                                let element = disabled && disabledElement === 'field' ? 'text-field' : inputType
                                if (editableState.editingInline && editableState.rowIdx !== rowIdx) {
                                  element = 'text-field'
                                }

                                let finalChoices
                                if (typeof choices === 'function') {
                                  finalChoices = choices({ row, rowIdx, colIdx, dataKey, rows: fields?.value })
                                } else if (Array.isArray(choices)) {
                                  finalChoices = choices
                                } else if (element === 'auto-complete-input' && !isEmpty(choiceData) && !isEmpty(choiceData[dataKey])) {
                                  finalChoices = Object.values(choiceData[dataKey])
                                }
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
                                        form={form}
                                        validate={validate}
                                        disabled={disabled}
                                        variant={variant}
                                        fontSize={fontSize}
                                        i18nMap={i18nMap}
                                        options={options}
                                        handleOnChange={handleOnChange}
                                      />
                                    )}
                                    {element === 'file-input' && (
                                      <FileInput
                                        name={`${name}.${dataKey}`}
                                        form={form}
                                        validate={validate}
                                        disabled={disabled}
                                        fontSize={fontSize}
                                        i18nMap={i18nMap}
                                        options={options}
                                        handleOnChange={handleOnChange}
                                      />
                                    )}
                                    {element === 'select-input' && (
                                      <SelectInput
                                        name={`${name}.${dataKey}`}
                                        form={form}
                                        choices={finalChoices}
                                        validate={validate}
                                        disabled={disabled}
                                        variant={variant}
                                        fontSize={fontSize}
                                        i18nMap={i18nMap}
                                        options={options}
                                        handleOnChange={handleOnChange}
                                      />
                                    )}
                                    {element === 'auto-complete-input' && (
                                      <AutoCompleteInput
                                        name={`${name}.${dataKey}`}
                                        form={form}
                                        choices={finalChoices}
                                        updateChoices={handleChoiceFetch}
                                        validate={validate}
                                        disabled={disabled}
                                        variant={variant}
                                        fontSize={fontSize}
                                        i18nMap={i18nMap}
                                        options={options}
                                        handleOnChange={handleOnChange}
                                      />
                                    )}
                                    {element === 'boolean-input' && (
                                      <BooleanInput
                                        name={`${name}.${dataKey}`}
                                        form={form}
                                        disabled={disabled}
                                        options={options}
                                        handleOnChange={handleOnChange}
                                      />
                                    )}
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
                                showChildAddAction,
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
  const isTreeTable =
    props.isTreeTable ||
    !isEmpty(props.parentIdKey) ||
    props?.rows.filter((row) => Object.prototype.hasOwnProperty.call(row, props.parentIdKey || 'parentId')).length > 0 // Check Whether idKey exists in rows

  const { rows, editable, enableRowAddition, inlineActions, footerActions, toolbar, totalRowKey, variant, fontSize, rowAddCount, validate } = props

  const columns = props.columns?.map((c) => ({ ...c, validate: Array.isArray(c.validate) ? composeValidators(c.validate) : c.validate }))

  // Disable these features in Tree Table
  const searchable = props.searchable
  const sortable = props.sortable
  const pageable = props.pageable
  const selectAll = props.multiSelect ? props.selectAll : false

  const {
    rowList,
    key,
    updateFilter,
    resetFilter,
    editableState,
    selected,
    filterValues,
    handleSubmit,
    handleOnChange,
    i18nMap,
    ...restProps
  } = useMuiTable({
    ...props,
    isTreeTable,
    searchable,
    pageable,
    sortable
  })

  const classes = useStyles({ variant, pageable, editable, fontSize, footerActions })

  const [choiceData, setChoiceData] = useState({}) // {[dataKey]: {[id]: choice}}

  // Initialize Initial Choices for AutoComplete Input with empty searchText //
  useEffect(() => {
    if (isEmpty(columns) || !editableState.editing) return
    columns
      .filter((c) => c.inputType === 'auto-complete-input' && typeof c.fetchChoices === 'function')
      .forEach((column) => {
        const result1 = column.fetchChoices('', rowList)
        if (isPromise(result1)) {
          result1.then((choiceList) => {
            if (Array.isArray(choiceList)) {
              const data = choiceList.reduce((acc, e) => ({ ...acc, [e.id]: e }), {})
              setChoiceData((prev) => ({ ...prev, [column.dataKey]: { ...prev[column.dataKey], ...data } }))
            }
          })
        }
        const result2 = column.fetchChoices('', [])
        if (isPromise(result2)) {
          result2.then((choiceList) => {
            if (Array.isArray(choiceList)) {
              const data = choiceList.reduce((acc, e) => ({ ...acc, [e.id]: e }), {})
              setChoiceData((prev) => ({ ...prev, [column.dataKey]: { ...prev[column.dataKey], ...data } }))
            }
          })
        }
      })
  }, [JSON.stringify(columns), JSON.stringify(rowList), editableState.editing])

  const isSelected = (id) => selected.indexOf(id) !== -1

  const filterColumns = columns
    .filter((c) => c.filterOptions?.filter)
    .map((c) => {
      const isCsvText = c.filterOptions?.isCsvText || false
      let valueList = rows.map((row) => row[c.dataKey]).filter((e) => typeof e === 'string' || typeof e === 'number')
      if (isCsvText) {
        valueList = valueList
          .filter((v) => !isEmpty(v))
          .flatMap((v) => v.split(','))
          .filter((v) => !isEmpty(v))
          .map((v) => v.trim())
      }
      const choices = getDistinctValues(valueList).map((v) => ({ id: v, name: nameFromId(c, rows, v) }))
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
  if (filterColumns.length > 0) {
    toolbarActions.push({ name: 'filter' })
  }

  const showToolbar =
    toolbar || !isEmpty(toolbarActions) || (selected.length > 0 && !isEmpty(props.selectActions)) || searchable || filterColumns.length > 0
  // when actions are provided and not in colletive editing mode. (i.e - hide actions in collective editing mode)
  const showActions = (typeof inlineActions === 'function' || inlineActions.length > 0) && !editableState.editing

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
              .map(() => ({ [props.idKey]: isTreeTable ? new Date().getTime() : undefined }))
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
        {({ form, handleSubmit, submitting, hasValidationErrors }) => {
          props.handleSubmitRef && props.handleSubmitRef(handleSubmit)
          return React.createElement(
            props.component,
            { onSubmit: handleSubmit },
            <FormContent
              {...props}
              {...restProps}
              classes={classes}
              form={form}
              handleOnChange={handleOnChange}
              submitting={submitting}
              hasValidationErrors={hasValidationErrors}
              columns={columns}
              rows={rows}
              rowList={rowList}
              isTreeTable={isTreeTable}
              editable={editable}
              selectAll={selectAll}
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
              choiceData={choiceData}
              setChoiceData={setChoiceData}
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
  showLabel: PropTypes.bool,
  icon: PropTypes.any,
  options: PropTypes.object
})

MuiTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string,
      title: PropTypes.string,
      hidden: PropTypes.bool,
      inputType: PropTypes.oneOf(['text-field', 'text-input', 'select-input', 'boolean-input', 'date-input', 'file-input', 'auto-complete-input']),
      // when inputType is 'select' or 'auto-complete'
      choices: PropTypes.oneOfType([PropTypes.arrayOf(OptionType), PropTypes.func]),
      fetchChoices: PropTypes.func,
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
  headerRows: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  titleSelected: PropTypes.func,
  isTreeTable: PropTypes.bool,
  toolbar: PropTypes.bool,
  toolbarDivider: PropTypes.bool,
  editable: PropTypes.bool,
  enableRowAddition: PropTypes.bool, // Whether row addition should be enabled in editable mode.
  searchable: PropTypes.bool,
  searchKeys: PropTypes.arrayOf(PropTypes.string),
  selectable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]), // boolean | (row) => boolean
  selectAll: PropTypes.bool,
  multiSelect: PropTypes.bool, // Whether multiple rows can be selected for selectable table
  pageSelect: PropTypes.bool, // Select Current page only on selectAll
  sortable: PropTypes.bool,
  defaultSort: PropTypes.shape({
    field: PropTypes.string.isRequired,
    order: PropTypes.oneOf(['asc', 'desc'])
  }),
  pageable: PropTypes.bool,
  tableProps: PropTypes.object,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  pageSize: PropTypes.number,
  idKey: PropTypes.string, // Identifier Key in row object. This is used for selection and in tree table
  totalRowKey: PropTypes.string, // For flaging a row as total row, set true value in totalRowKey
  parentIdKey: PropTypes.string, // Identifier Key of parent in row object. This is used in tree table
  selectActions: PropTypes.arrayOf(ActionType), // standard actions - add, delete, edit
  toolbarActions: PropTypes.arrayOf(ActionType), // standard actions - column
  inlineActions: PropTypes.oneOfType([PropTypes.arrayOf(ActionType), PropTypes.func]), // standard actions - edit, delete, add, duplicate
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
  showChildAddAction: PropTypes.func, // For TreeTable whether addChild action should be shown. (row, rows) => bool

  toolbarStyle: PropTypes.object,
  rowStyle: PropTypes.oneOfType([PropTypes.func, PropTypes.object]), // ({row, rowIdx}) => Object
  headerCellStyle: PropTypes.oneOfType([PropTypes.func, PropTypes.object]), // ({row, column, rowIdx, columnIdx}) => Object
  cellStyle: PropTypes.oneOfType([PropTypes.func, PropTypes.object]), // ({row, column, rowIdx, columnIdx}) => Object
  validate: PropTypes.func, // (values: FormValues) => Object | Promise<Object>
  onSubmit: PropTypes.func,
  onChange: PropTypes.func, // (row, dataKey, value, form) => {}
  onSelectActionClick: PropTypes.func, // (event, action, rows, onActionComplete) => void
  onSelect: PropTypes.func, // (selectedIds) => void
  onRowClick: PropTypes.func, // (row) => void
  onFilter: PropTypes.func, // (filterValues) => void
  onToolbarActionClick: PropTypes.func, // (event, action, rows) => void
  onInlineActionClick: PropTypes.func, // (event, action, row, onActionComplete) => void
  onFooterActionClick: PropTypes.func, // (event, action, rows, filterValues, onActionComplete) => void
  onTreeExpand: PropTypes.func, // (event, row, isExpanded) => any
  fetchChildren: PropTypes.func, // Fetch children if children placeholder is only there
  defaultExpanded: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]), // bool | (row, level) => bool
  comparator: PropTypes.func,
  handleSubmitRef: PropTypes.func // When Form is submited externally, get hold of ReactFinalForm handleSubmit function by passing this function.
}

MuiTable.defaultProps = {
  columns: [],
  rows: [],
  title: 'Mui Table',
  isTreeTable: false,
  toolbar: false,
  toolbarDivider: true,
  searchable: false,
  searchKeys: ['name'],
  editable: false,
  enableRowAddition: false,
  selectable: false,
  selectAll: true,
  multiSelect: true,
  pageSelect: true,
  sortable: false,
  pageable: false,
  idKey: 'id',
  totalRowKey: 'totalRow',
  rowsPerPageOptions: [10, 25],
  pageSize: 10,
  selectActions: [],
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
