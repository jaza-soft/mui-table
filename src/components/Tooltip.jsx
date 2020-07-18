import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'

export default withStyles((theme) => ({
  tooltip: {
    padding: theme.typography.pxToRem(8),
    fontSize: theme.typography.pxToRem(12)
    // backgroundColor: '#f5f5f9',
    // color: 'rgba(0, 0, 0, 0.87)',
    // maxWidth: 220,
    // border: '1px solid #dadde9'
  }
}))(Tooltip)
