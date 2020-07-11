import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
})

const MuiTable = ({ columns = [], rows = [] }) => {
  const classes = useStyles()

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label='simple table'>
        <TableHead>
          <TableRow>
            {columns.map(({ title, align, headerCellProps }, colIdx) => (
              <TableCell key={colIdx} align={align} {...headerCellProps}>
                {title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIdx) => (
            <TableRow key={rowIdx}>
              {columns.map(({ dataKey, align, rowCellProps }, colIdx) => (
                <TableCell
                  key={`${rowIdx}-${colIdx}`}
                  align={align}
                  {...rowCellProps}
                >
                  {row[dataKey]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

MuiTable.propTypes = {
  editable: PropTypes.bool,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string,
      title: PropTypes.string,
      align: PropTypes.oneOf(['center', 'inherit', 'justify', 'left', 'right'])
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired
}
MuiTable.defaultProps = {
  editable: false
}

export default MuiTable
