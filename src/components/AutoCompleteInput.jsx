import React, { useCallback, useState } from 'react'
import lodashDebounce from 'lodash.debounce'

import { Field } from 'react-final-form'

import { makeStyles } from '@material-ui/core/styles'
import MuiTextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

import ValidationError from './ValidationError'
import { isEmpty } from '../utils/helper'

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

const AutoCompleteInput = React.memo(
  ({ name, validate, choices = [], disabled, variant, fontSize, i18nMap, form, handleOnChange, options, updateChoices }) => {
    const classes = useStyles({ variant, fontSize })

    const [searchText, setSearchText] = useState('')

    const debouncedUpdateChoices = useCallback(
      lodashDebounce((text) => updateChoices && updateChoices(text), 500),
      []
    )

    const onInputChange = (event, newValue) => {
      setSearchText(newValue)
      if (!isEmpty(newValue)) {
        debouncedUpdateChoices(newValue)
      }
    }

    const onChange = (input) => (event, newValue) => {
      handleOnChange && handleOnChange(name, newValue, form)
      input.onChange(newValue)
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
              <Autocomplete
                value={value}
                onChange={onChange(input)}
                inputValue={searchText || value}
                onInputChange={onInputChange}
                options={choices.map((e) => e.id)}
                getOptionLabel={(option) => choices.find((e) => e.id === option)?.name || ''}
                renderInput={(params) => (
                  <MuiTextField {...params} onFocus={input.onFocus} onBlur={input.onBlur} placeholder={options?.placeholder || 'Search'} />
                )}
                {...options}
                disabled={typeof disabled === 'function' ? disabled({ rowIdx, colIdx, column, record }) : disabled}
              />

              {meta.touched && meta.error && (
                <FormHelperText id={`${name}-error`}>
                  <ValidationError error={meta.error} i18nMap={i18nMap} />
                </FormHelperText>
              )}
            </FormControl>
          )
        }}
      </Field>
    )
  }
)

export default AutoCompleteInput
