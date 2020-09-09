import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'

import { capitalize } from '../utils/helper'

const useStyles = makeStyles({
  root: {
    padding: '0 0.5em'
  },
  chip: {
    margin: '0.25em'
  }
})

const FilterList = ({ data, removeFilter, chipOptions }) => {
  const classes = useStyles()

  const handleDelete = (dataKey, value) => {
    removeFilter && removeFilter(dataKey, value)
  }

  return (
    <div className={classes.root}>
      {data.map(({ dataKey, title, value, name, showValueOnly = true }, idx) => {
        let label = `${name}`
        if (!showValueOnly) {
          const key = title || capitalize(dataKey)
          label = key ? `${key}: ${name}` : label
        }
        return (
          <Chip
            className={classes.chip}
            key={idx}
            label={label}
            onDelete={() => handleDelete(dataKey, value)}
            variant='outlined'
            color='primary'
            {...chipOptions}
          />
        )
      })}
    </div>
  )
}

FilterList.propType = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string,
      title: PropTypes.string,
      value: PropTypes.any,
      showValueOnly: PropTypes.bool // default: true
    })
  ),
  removeFilter: PropTypes.func,
  chipOptions: PropTypes.object
}

FilterList.defaultProps = {
  data: [],
  chipOptions: {}
}

export default FilterList
