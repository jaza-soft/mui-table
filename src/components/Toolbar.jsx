import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { lighten, makeStyles } from '@material-ui/core/styles'
import MuiToolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add'
import FilterListIcon from '@material-ui/icons/FilterList'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import ClearIcon from '@material-ui/icons/Clear'
import SearchIcon from '@material-ui/icons/Search'

import Tooltip from './Tooltip'
import Popover from './Popover'
import Filter from './Filter'

import { capitalize, getLabel } from '../utils/helper'
import i18nMap from '../utils/i18nMap'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: '1 1 100%'
  },
  search: {
    marginRight: theme.spacing(1),
    width: 250
  }
}))

const Toolbar = (props) => {
  const { title, selectedCount, selectActions, toolbarActions, filterProps, onSearch, onSelectActionClick, onToolbarActionClick } = props
  const classes = useStyles()

  const [filterActive, setFilterActive] = React.useState(false)
  const [searchText, setSearchText] = React.useState('')

  const handleSearchText = (event) => {
    const value = event.target.value
    setSearchText(value)
    onSearch && onSearch(value)
  }

  const clearSearchText = () => {
    setSearchText('')
    onSearch && onSearch('')
  }

  const createSelectActionHandler = (action) => (event) => {
    onSelectActionClick && onSelectActionClick(event, action)
  }

  const createToolbarActionHandler = (action) => (event) => {
    if (action === 'filter') {
      setFilterActive(true)
    }
    onToolbarActionClick && onToolbarActionClick(event, action)
  }

  return (
    <MuiToolbar
      className={clsx(classes.root, {
        [classes.highlight]: selectedCount > 0
      })}
    >
      {selectedCount > 0 ? (
        <Typography className={classes.title} color='inherit' variant='subtitle1' component='div'>
          {getLabel(`text.selected`, null, i18nMap, { _: `${selectedCount} items Selected`, count: selectedCount })}
        </Typography>
      ) : (
        <Typography className={classes.title} variant='h6' id='tableTitle' component='div'>
          {getLabel(`text.title`, null, i18nMap, { _: title })}
        </Typography>
      )}

      {selectedCount > 0
        ? selectActions.map(({ name, tooltip, icon, options }, idx) => (
            <Tooltip key={idx} title={getLabel(`selectAction.${name}`, tooltip, i18nMap, { _: capitalize(name) })} arrow>
              <IconButton
                aria-label={getLabel(`selectAction.${name}`, tooltip, i18nMap, { _: capitalize(name) })}
                onClick={createSelectActionHandler(name)}
                {...options}
              >
                {name === 'add' && <AddIcon />}
                {name === 'edit' && <EditIcon />}
                {name === 'delete' && <DeleteIcon />}
                {!['add', 'edit', 'delete'].includes(name) && icon}
              </IconButton>
            </Tooltip>
          ))
        : toolbarActions.map(({ name, tooltip, icon, options }, idx) => (
            <div key={idx}>
              {name === 'filter' && (
                <Popover
                  onExited={() => setFilterActive(false)}
                  hide={!filterActive}
                  trigger={
                    <Tooltip title={getLabel(`toolbarAction.${name}`, tooltip, i18nMap, { _: capitalize(name) })} disableFocusListener>
                      <IconButton
                        aria-label={getLabel(`toolbarAction.${name}`, tooltip, i18nMap, { _: capitalize(name) })}
                        onClick={createToolbarActionHandler(name)}
                      >
                        <FilterListIcon />
                      </IconButton>
                    </Tooltip>
                  }
                  content={<Filter {...filterProps} />}
                />
              )}
              {name === 'search' && (
                <Input
                  className={classes.search}
                  value={searchText}
                  onChange={handleSearchText}
                  placeholder={getLabel(`text.search`, null, i18nMap, { _: 'Search' })}
                  startAdornment={
                    <InputAdornment position='start'>
                      <IconButton size='small'>
                        <SearchIcon fontSize='small' />
                      </IconButton>
                    </InputAdornment>
                  }
                  endAdornment={
                    searchText ? (
                      <InputAdornment position='end'>
                        <IconButton size='small' onClick={clearSearchText}>
                          <ClearIcon fontSize='small' />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }
                />
              )}
              {!['search', 'filter', 'column'].includes(name) && icon && (
                <Tooltip title={getLabel(`toolbarAction.${name}`, tooltip, i18nMap, { _: capitalize(name) })} disableFocusListener>
                  <IconButton
                    aria-label={getLabel(`toolbarAction.${name}`, tooltip, i18nMap, { _: capitalize(name) })}
                    onClick={createToolbarActionHandler(name)}
                    {...options}
                  >
                    {icon}
                  </IconButton>
                </Tooltip>
              )}
            </div>
          ))}
    </MuiToolbar>
  )
}

const ActionType = PropTypes.shape({
  name: PropTypes.string,
  tooltip: PropTypes.string,
  icon: PropTypes.any,
  options: PropTypes.object
})

Toolbar.propTypes = {
  title: PropTypes.string.isRequired,
  selectedCount: PropTypes.number,
  selectActions: PropTypes.arrayOf(ActionType), // standard actions - add, delete, edit
  toolbarActions: PropTypes.arrayOf(ActionType), // standard actions -  search, filter, column
  filterProps: PropTypes.object,
  onSearch: PropTypes.func,
  onSelectActionClick: PropTypes.func,
  onToolbarActionClick: PropTypes.func
}

Toolbar.defaultProps = {
  selectedCount: 0,
  selectActions: [{ name: 'delete' }],
  toolbarActions: [{ name: 'search' }]
}

export default Toolbar
