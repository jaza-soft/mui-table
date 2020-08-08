import React from 'react'
import { Field } from 'react-final-form'

import Tooltip from './Tooltip'
import { multiLineText } from '../utils/helper'

const sanitizeOptions = ({ displayEmpty, ...restOptions }) => restOptions

const TextField = React.memo(({ name, render, cellOverFlow, length, cellLength, options = {} }) => {
  return (
    <Field name={name}>
      {({ input }) => {
        const finalLength = length || cellLength
        let value = input?.value
        let shortValue = value
        if (typeof value === 'string') {
          const texts = multiLineText(value, finalLength)
          if (cellOverFlow === 'tooltip') {
            shortValue = texts[0]
          } else if (cellOverFlow === 'wrap') {
            shortValue = texts.join('\n')
          }
        }
        const finalValue = typeof render === 'function' ? render(value, shortValue) : shortValue

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
