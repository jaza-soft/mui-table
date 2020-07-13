import React from 'react'
import { Field } from 'react-final-form'
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

// const required = (value) => (value ? undefined : 'Required')

const TextInput = React.memo(({ name, validate }) => {
  return (
    <Field name={name} validate={validate}>
      {({ input, meta }) => {
        return (
          <FormControl error={meta.touched && !!meta.error}>
            <Input inputProps={{ ...input }} />
            {meta.touched && meta.error && (
              <FormHelperText id='component-error-text'>
                {meta.error}
              </FormHelperText>
            )}
          </FormControl>
        )
      }}
    </Field>
  )
})

export default TextInput
