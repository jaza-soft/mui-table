import React from 'react'
import { Field } from 'react-final-form'

const TextField = React.memo(({ name, render, options }) => {
  return (
    <Field name={name}>
      {({ input }) => {
        if (typeof render === 'function') {
          return render(input?.value)
        }
        return <span {...options}>{input?.value}</span>
      }}
    </Field>
  )
})

export default TextField
