import React from 'react'

import { Field } from 'react-final-form'

import Switch from '@material-ui/core/Switch'

const TextInput = React.memo(({ name, validate, options }) => {
  return (
    <Field name={name} validate={validate}>
      {({ input }) => {
        const { value, ...inputProps } = input
        return (
          <Switch
            id={`${name}-switch`}
            {...inputProps}
            checked={!!value}
            onChange={(event, value) => {
              input?.onChange(value)
            }}
            color='primary'
            {...options}
          />
        )
      }}
    </Field>
  )
})

export default TextInput
