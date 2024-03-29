import React from 'react'
import clsx from 'clsx'

import { Field } from 'react-final-form'

import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

import ValidationError from './ValidationError'

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

const TextInput = React.memo(({ name, validate, disabled, variant, fontSize, i18nMap, form, handleOnChange, options }) => {
  const classes = useStyles({ variant, fontSize })

  const onChange = (input) => (event) => {
    const value = event?.target?.value
    handleOnChange && handleOnChange(name, value, form)
    input.onChange(event)
  }

  return (
    <Field name={name} validate={validate}>
      {({ input, meta }) => {
        return (
          <FormControl className={classes.formControl} error={meta.touched && !!meta.error}>
            {variant !== 'excel' && (
              <Input
                className={clsx(classes.input, options?.className)}
                id={`${name}-text-input`}
                inputProps={{ ...input, onChange: onChange(input) }}
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
                onChange={onChange(input)}
                disabled={disabled}
              />
            )}

            {meta.touched && meta.error && (
              <FormHelperText id={`${name}-error`}>
                <ValidationError error={meta.error?.message || meta.error} i18nMap={i18nMap} />
              </FormHelperText>
            )}
          </FormControl>
        )
      }}
    </Field>
  )
})

export default TextInput
