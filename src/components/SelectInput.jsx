import React from 'react'
import clsx from 'clsx'

import { Field } from 'react-final-form'

import { makeStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'

import ValidationError from './ValidationError'

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%'
  },
  select: (props) => ({
    padding: '0px 8px',
    fontSize: theme.typography.pxToRem(props.fontSize),
    backgroundColor: props.variant === 'excel' ? 'rgba(233, 246, 252, 0.5)' : undefined
  })
}))

const SelectInput = React.memo(({ name, validate, choices = [], disabled, variant, fontSize, i18nMap, form, handleOnChange, options }) => {
  const classes = useStyles({ variant, fontSize })

  const onChange = (input) => (event) => {
    const value = event?.target?.value
    handleOnChange && handleOnChange(name, value, form)
    input.onChange(event)
  }

  return (
    <Field name={name} validate={validate}>
      {({ input, meta }) => {
        let value = input?.value
        if (options?.multiple) {
          value = Array.isArray(value) ? value : []
        }
        return (
          <FormControl className={classes.formControl} style={{ width: options?.style?.width }} error={meta.touched && !!meta.error}>
            <Select
              className={clsx(classes.select, options?.className)}
              id={`${name}-select-input`}
              input={<Input disableUnderline={variant === 'excel'} />}
              inputProps={{ ...input, value, onChange: onChange(input) }}
              {...options}
              disabled={disabled}
            >
              {options?.displayEmpty && (
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
              )}
              {choices.map((choice, idx) => (
                <MenuItem key={idx} value={choice.id}>
                  {choice.name}
                </MenuItem>
              ))}
            </Select>

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

export default SelectInput
