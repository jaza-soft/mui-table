import React from 'react'
import clsx from 'clsx'

import { Field } from 'react-final-form'

import { makeStyles } from '@material-ui/core'
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

const useStyles = makeStyles({
  defaultFormControl: {
    minWidth: 120
  },
  excelFormControl: {
    width: '100%'
  }
})

const TextInput = React.memo(({ name, validate, disabled, variant, options }) => {
  const classes = useStyles()

  return (
    <Field name={name} validate={validate}>
      {({ input, meta }) => {
        return (
          <FormControl className={clsx({ [classes[`${variant}FormControl`]]: variant })} error={meta.touched && !!meta.error}>
            {variant !== 'excel' && (
              <Input
                id={`${name}-text-input`}
                inputProps={{ ...input }}
                {...options}
                style={{ fontSize: 12, ...options?.style }}
                disabled={disabled}
              />
            )}
            {variant === 'excel' && (
              <input
                id={`${name}-text-input`}
                {...input}
                {...options}
                disabled={disabled}
                style={{
                  padding: 8,
                  border: 'none',
                  fontSize: 12,
                  backgroundColor: 'rgba(3, 138, 255, 0.03)',
                  ...options?.style
                }}
              />
            )}

            {meta.touched && meta.error && <FormHelperText id={`${name}-error`}>{meta.error}</FormHelperText>}
          </FormControl>
        )
      }}
    </Field>
  )
})

export default TextInput
