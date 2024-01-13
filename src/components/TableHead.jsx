import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import { makeStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import MuiTableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Checkbox from '@material-ui/core/Checkbox'

import { getLabel, isEmpty } from '../utils/helper'

const useStyles = makeStyles({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
})

const TableHead = (props) => {
  const classes = useStyles()
  const {
    editing,
    selectable,
    selectAll,
    sortable,
    isTreeTable,
    columns,
    headerRows,
    headerCellStyle,
    onSelectAllClick,
    order,
    orderBy,
    selectedCount,
    rowCount,
    showActions,
    actionPlacement,
    onRequestSort,
    i18nMap
  } = props

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <MuiTableHead>
      {isEmpty(headerRows) && (
        <TableRow>
          {!!selectable && !editing && (
            <TableCell padding={selectAll ? 'checkbox' : undefined}>
              {selectAll && (
                <Checkbox
                  indeterminate={selectedCount > 0 && selectedCount < rowCount}
                  checked={rowCount > 0 && selectedCount === rowCount}
                  onChange={onSelectAllClick}
                  inputProps={{ 'aria-label': 'select all desserts' }}
                />
              )}
            </TableCell>
          )}
          {isTreeTable && <TableCell padding='checkbox' />}

          {showActions && actionPlacement === 'left' && (
            <TableCell align='left'>{getLabel(`text.actions`, null, i18nMap, { _: 'Actions' })}</TableCell>
          )}

          {columns
            .filter((c) => isEmpty(c.hidden) || c.hidden === false)
            .map(({ dataKey, title, align, headerCellProps }, idx) => (
              <TableCell
                key={idx}
                className={clsx(props.classes?.headerCell, props.options?.className)}
                align={align}
                padding={selectable && !editing && idx === 0 ? 'none' : 'default'}
                sortDirection={orderBy === dataKey ? order : false}
                {...headerCellProps}
              >
                {sortable && !editing ? (
                  <TableSortLabel active={orderBy === dataKey} direction={orderBy === dataKey ? order : 'asc'} onClick={createSortHandler(dataKey)}>
                    {getLabel(`fields.${dataKey}`, null, i18nMap, { _: title })}
                    {orderBy === dataKey ? (
                      <span className={classes.visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
                    ) : null}
                  </TableSortLabel>
                ) : (
                  getLabel(`fields.${dataKey}`, null, i18nMap, { _: title })
                )}
              </TableCell>
            ))}

          {showActions && actionPlacement === 'right' && (
            <TableCell align='right'>{getLabel(`text.actions`, null, i18nMap, { _: 'Actions' })}</TableCell>
          )}
        </TableRow>
      )}

      {!isEmpty(headerRows) &&
        headerRows.map((headerRow, rowIdx) => {
          const cols = columns.flatMap((c, colIdx) => {
            let colSpan = 1
            if (typeof c.colSpan === 'function') {
              colSpan = c.colSpan({ column: c, row: headerRow, colIdx, rowIdx })
            }
            return colSpan === 0 ? [] : { ...c, colSpan }
          })
          return (
            <TableRow key={rowIdx}>
              {cols.map(({ dataKey, title, align, colSpan, headerCellProps }, colIdx) => {
                const value = headerRow[dataKey]
                const style =
                  typeof headerCellStyle === 'function'
                    ? headerCellStyle({
                        row: headerRow,
                        column: { dataKey, title, align, colSpan, headerCellProps },
                        rowIdx,
                        colIdx
                      })
                    : headerCellStyle
                return (
                  <TableCell
                    key={`${rowIdx}-${colIdx}`}
                    colSpan={colSpan}
                    align={align}
                    className={clsx(props.classes?.headerCell, props.options?.className)}
                    padding={selectable && !editing && colIdx === 0 ? 'none' : 'default'}
                    sortDirection={orderBy === dataKey ? order : false}
                    {...headerCellProps}
                    style={{ ...headerCellProps?.style, ...style }}
                  >
                    {value}
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
    </MuiTableHead>
  )
}

TableHead.propTypes = {
  selectable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  selectAll: PropTypes.bool,
  editing: PropTypes.bool, // Remove Selectable Column while editing
  sortable: PropTypes.bool,
  isTreeTable: PropTypes.bool,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string,
      title: PropTypes.string,
      align: PropTypes.oneOf(['center', 'inherit', 'justify', 'left', 'right']),
      headerCellProps: PropTypes.object,
      rowCellProps: PropTypes.object
    })
  ).isRequired,
  // Selection Releated Props
  selectedCount: PropTypes.number.isRequired, // No of Rows Selected
  rowCount: PropTypes.number.isRequired, // Total Number of Rows in Table
  onSelectAllClick: PropTypes.func.isRequired,
  // Inline Action
  showActions: PropTypes.bool,
  actionPlacement: PropTypes.oneOf(['left', 'right']),
  // Sorting will be applied on only of the fields
  order: PropTypes.oneOf(['asc', 'desc']).isRequired, // sort direction
  orderBy: PropTypes.string, // sort column
  onRequestSort: PropTypes.func.isRequired
}

TableHead.defaultProps = {
  editing: false,
  selectable: false,
  selectAll: true,
  sortable: false,
  isTreeTable: false,
  columns: [],
  showActions: false,
  actionPlacement: 'right'
}

export default TableHead
