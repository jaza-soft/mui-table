import React from 'react'
import clsx from 'clsx'

import { Field } from 'react-final-form'

import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

const useStyles = makeStyles((theme) => ({
  formControl: (props) => ({
    minWidth: props.variant === 'excel' ? '100%' : 120
  }),
  input: (props) => ({
    fontSize: theme.typography.pxToRem(props.fontSize)
  }),
  nativeInput: (props) => ({
    fontSize: theme.typography.pxToRem(props.fontSize),
    padding: 8,
    border: 'none',
    backgroundColor: 'rgba(233, 246, 252, 0.5)'
  })
}))

const TextInput = React.memo(({ name, validate, disabled, variant, fontSize, options }) => {
  const classes = useStyles({ variant, fontSize })

  return (
    <Field name={name} validate={validate}>
      {({ input, meta }) => {
        return (
          <FormControl className={classes.formControl} error={meta.touched && !!meta.error}>
            {variant !== 'excel' && (
              <Input
                className={clsx(classes.input, options?.className)}
                id={`${name}-text-input`}
                inputProps={{ ...input }}
                {...options}
                disabled={disabled}
              />
            )}
            {variant === 'excel' && (
              <input
                className={clsx(classes.nativeInput, options?.className)}
                id={`${name}-text-input`}
                {...input}
                {...options}
                disabled={disabled}
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
