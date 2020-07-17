import React from 'react'

import { Field } from 'react-final-form'

import { makeStyles } from '@material-ui/core'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'

const useStyles = makeStyles({
  formControl: {
    width: '100%'
  }
})

const SelectInput = React.memo(({ name, validate, choices = [], disabled, variant, options }) => {
  const classes = useStyles()

  return (
    <Field name={name} validate={validate}>
      {({ input, meta }) => {
        return (
          <FormControl className={classes.formControl} style={{ width: options?.style?.width }} error={meta.touched && !!meta.error}>
            <Select
              id={`${name}-select-input`}
              input={<Input disableUnderline={variant === 'excel'} />}
              inputProps={{ ...input }}
              {...options}
              disabled={disabled}
              style={{
                fontSize: 12,
                padding: '0px 8px',
                backgroundColor: variant === 'excel' ? 'rgba(3, 138, 255, 0.03)' : undefined,
                ...options?.style
              }}
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

            {meta.touched && meta.error && <FormHelperText id={`${name}-error`}>{meta.error}</FormHelperText>}
          </FormControl>
        )
      }}
    </Field>
  )
})

export default SelectInput
