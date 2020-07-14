import React from 'react'

import { Field } from 'react-final-form'

import { makeStyles } from '@material-ui/core'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

const useStyles = makeStyles({
  formControl: {
    minWidth: 100
  }
})

const SelectInput = React.memo(
  ({ name, validate, choices = [], disabled, options }) => {
    const classes = useStyles()

    return (
      <Field name={name} validate={validate}>
        {({ input, meta }) => {
          return (
            <FormControl
              className={classes.formControl}
              error={meta.touched && !!meta.error}
            >
              <Select
                id={`${name}-select-input`}
                inputProps={{ ...input }}
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
                  {meta.error}
                </FormHelperText>
              )}
            </FormControl>
          )
        }}
      </Field>
    )
  }
)

export default SelectInput
