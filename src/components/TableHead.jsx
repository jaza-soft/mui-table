import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import { makeStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import MuiTableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Checkbox from '@material-ui/core/Checkbox'

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
    columns,
    onSelectAllClick,
    order,
    orderBy,
    selectedCount,
    rowCount,
    showActions,
    actionPlacement,
    onRequestSort
  } = props

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <MuiTableHead>
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

        {showActions && actionPlacement === 'left' && <TableCell align='left'>Actions</TableCell>}

        {columns.map(({ dataKey, title, align, headerCellProps }, idx) => (
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
                {title}
                {orderBy === dataKey ? (
                  <span className={classes.visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
                ) : null}
              </TableSortLabel>
            ) : (
              title
            )}
          </TableCell>
        ))}

        {showActions && actionPlacement === 'right' && <TableCell align='right'>Actions</TableCell>}
      </TableRow>
    </MuiTableHead>
  )
}

TableHead.propTypes = {
  selectable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  selectAll: PropTypes.bool,
  editing: PropTypes.bool, // Remove Selectable Column while editing
  sortable: PropTypes.bool,
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
  columns: [],
  showActions: false,
  actionPlacement: 'right'
}

export default TableHead
