import React from 'react'
import { Field } from 'react-final-form'

const TextField = React.memo(({ name }) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        return <span>{input?.value}</span>
      }}
    </Field>
  )
})

export default TextField
