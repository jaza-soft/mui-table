import React from 'react'
import { Field } from 'react-final-form'

import Tooltip from './Tooltip'
import { multiLineText, truncate } from '../utils/helper'

const sanitizeOptions = ({ displayEmpty, ...restOptions }) => restOptions

const TextField = React.memo(({ name, row, render, cellOverFlow, length, cellLength, options = {} }) => {
  return (
    <Field name={name}>
      {({ input }) => {
        const finalLength = length || cellLength
        let value = input?.value
        let shortValue = value
        if (typeof value === 'string') {
          const texts = multiLineText(value, finalLength)
          if (cellOverFlow === 'tooltip') {
            shortValue = truncate(texts[0], finalLength)
          } else if (cellOverFlow === 'wrap') {
            shortValue = texts.join('\n')
          }
        }
        const finalValue = typeof render === 'function' ? render(value, shortValue, row) : shortValue

        return cellOverFlow === 'tooltip' && value !== shortValue ? (
          <Tooltip title={value}>
            <span {...sanitizeOptions(options)}>{finalValue}...</span>
          </Tooltip>
        ) : (
          <span {...sanitizeOptions(options)}>{finalValue}</span>
        )
      }}
    </Field>
  )
})

export default TextField
