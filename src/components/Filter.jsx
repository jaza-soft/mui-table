import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Divider from '@material-ui/core/Divider'

import { getLabel } from '../utils/helper'

const useStyles = makeStyles({
  root: {
    minWidth: 500,
    backgroundColor: '#fafafa'
  },
  header: {
    padding: '0.5em 1em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content: {
    padding: '1em',
    paddingBottom: '2em'
  },
  formControl: {
    width: '100%'
  }
})

const Filter = (props) => {
  const { columns, filterValues = {}, updateFilter, resetFilter, i18nMap } = props
  const classes = useStyles()

  const handleChange = (event, dataKey) => {
    const value = event.target.value
    updateFilter && updateFilter(dataKey, value)
  }

  const handleReset = () => {
    resetFilter && resetFilter()
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography>{getLabel('text.filters', null, i18nMap, { _: 'Filters' })}</Typography>
        <Button onClick={handleReset}>{getLabel('text.reset', null, i18nMap, { _: 'Reset' })}</Button>
      </div>
      <Divider light variant='fullWidth' />
      <div className={classes.content}>
        <Grid container spacing={2}>
          {columns.map(({ title, dataKey, multiSelect = false, choices = [] }, idx) => {
            const defaultValue = multiSelect ? [] : ''
            return (
              <Grid key={idx} item xs={12} sm={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label'>{getLabel(`fields.${dataKey}`, null, i18nMap, { _: title })}</InputLabel>
                  <Select
                    value={filterValues[dataKey] || defaultValue}
                    multiple={multiSelect}
                    fullWidth
                    onChange={(event) => handleChange(event, dataKey)}
                  >
                    {choices.map((choice, idx) => (
                      <MenuItem key={idx} value={choice.id}>
                        {choice.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )
          })}
        </Grid>
      </div>
    </div>
  )
}

const OptionType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired
})

Filter.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string,
      title: PropTypes.string,
      choices: PropTypes.arrayOf(OptionType),
      multiSelect: PropTypes.bool // default: false
    })
  ),
  filterValues: PropTypes.object,
  updateFilter: PropTypes.func,
  resetFilter: PropTypes.func
}

Filter.defaultProps = {
  columns: []
}

export default Filter
