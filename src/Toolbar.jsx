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

import Tooltip from './Tooltip'

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
  }
}))

const Toolbar = ({ title, selectedCount, selectActions, onSelectActionClick }) => {
  const classes = useStyles()

  const createActionHandler = (action) => (event) => {
    onSelectActionClick(event, action)
  }

  return (
    <MuiToolbar
      className={clsx(classes.root, {
        [classes.highlight]: selectedCount > 0
      })}
    >
      {selectedCount > 0 ? (
        <Typography className={classes.title} color='inherit' variant='subtitle1' component='div'>
          {selectedCount} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant='h6' id='tableTitle' component='div'>
          {title}
        </Typography>
      )}

      {selectedCount > 0 ? (
        selectActions.map((action) => (
          <Tooltip key={action} title={action} arrow>
            <IconButton aria-label={action} onClick={createActionHandler(action)}>
              {action === 'add' && <AddIcon />}
              {action === 'edit' && <EditIcon />}
              {action === 'delete' && <DeleteIcon />}
            </IconButton>
          </Tooltip>
        ))
      ) : (
        <Tooltip title='Filter list' arrow>
          <IconButton aria-label='filter list'>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </MuiToolbar>
  )
}

Toolbar.propTypes = {
  title: PropTypes.string.isRequired,
  selectedCount: PropTypes.number,
  selectActions: PropTypes.arrayOf(PropTypes.oneOf(['add', 'delete', 'edit'])),
  onSelectActionClick: PropTypes.func
}

Toolbar.defaultProps = {
  selectedCount: 0,
  selectActions: ['delete']
}

export default Toolbar
