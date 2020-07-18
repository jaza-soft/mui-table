import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import MuiPopover from '@material-ui/core/Popover'

const Popover = ({ className, trigger, onExited, hide, content, ...restProps }) => {
  const [isOpen, open] = useState(false)
  const anchorEl = useRef(null)

  useEffect(() => {
    if (isOpen) {
      const shouldHide = typeof hide === 'boolean' ? hide : false
      if (shouldHide) {
        open(false)
      }
    }
  }, [hide, isOpen, open])

  const handleClick = (event) => {
    anchorEl.current = event.currentTarget
    open(true)
  }

  const handleRequestClose = () => {
    open(false)
  }

  const transformOriginSpecs = {
    vertical: 'top',
    horizontal: 'center'
  }

  const anchorOriginSpecs = {
    vertical: 'bottom',
    horizontal: 'center'
  }

  const handleOnExited = () => {
    if (onExited) {
      onExited()
    }
  }

  const triggerProps = {
    key: 'content',
    onClick: (event) => {
      if (trigger.props.onClick) trigger.props.onClick()
      handleClick(event)
    }
  }

  return (
    <React.Fragment>
      <span {...triggerProps}>{trigger}</span>
      <MuiPopover
        elevation={2}
        open={isOpen}
        onClose={handleRequestClose}
        onExited={handleOnExited}
        anchorEl={anchorEl.current}
        anchorOrigin={anchorOriginSpecs}
        transformOrigin={transformOriginSpecs}
        {...restProps}
      >
        {content}
      </MuiPopover>
    </React.Fragment>
  )
}

Popover.propTypes = {
  hide: PropTypes.bool,
  trigger: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  onExited: PropTypes.func
}

export default Popover
