import React from 'react'

import { Field } from 'react-final-form'

import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

const TextInput = React.memo(({ name, validate, disabled, options }) => {
  return (
    <Field name={name} validate={validate}>
      {({ input, meta }) => {
        return (
          <FormControl error={meta.touched && !!meta.error}>
            <Input
              id={`${name}-text-input`}
              inputProps={{ ...input }}
              {...options}
              disabled={disabled}
            />
            {meta.touched && meta.error && (
              <FormHelperText id={`${name}-error`}>{meta.error}</FormHelperText>
            )}
          </FormControl>
        )
      }}
    </Field>
  )
})

export default TextInput
