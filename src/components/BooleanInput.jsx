import React from 'react'

import { Field } from 'react-final-form'

import Switch from '@material-ui/core/Switch'

const BooleanInput = React.memo(({ name, validate, disabled, form, handleOnChange, options }) => {
  const onChange = (input) => (_, value) => {
    handleOnChange && handleOnChange(name, value, form)
    input?.onChange(value)
  }
  return (
    <Field name={name} validate={validate}>
      {({ input }) => {
        const { value, ...inputProps } = input
        return (
          <Switch
            id={`${name}-switch`}
            {...inputProps}
            checked={!!value}
            onChange={onChange(input)}
            color='primary'
            {...options}
            disabled={disabled}
          />
        )
      }}
    </Field>
  )
})

export default BooleanInput
