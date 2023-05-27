import React, { useCallback, useEffect, useState } from 'react'
import lodashDebounce from 'lodash.debounce'
import clsx from 'clsx'

import { Field } from 'react-final-form'

import { makeStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import MuiTextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'

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

const SelectInput = React.memo(
  ({ name, validate, choices, disabled, variant, fontSize, i18nMap, form, handleOnChange, options, argsChoiceFn = {} }) => {
    const classes = useStyles({ variant, fontSize })

    const [finalChoices, setFinalChoices] = useState([])
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
      if (Array.isArray(choices)) {
        setFinalChoices(choices)
      } else {
        const result = choices({ ...argsChoiceFn, searchText: '' })
        Promise.resolve(result).then((value) => {
          console.log({ value })
          if (Array.isArray(value)) {
            setFinalChoices(value)
          }
        })
      }
    }, [choices])

    const fetchChoices = useCallback(
      lodashDebounce((text) => {
        if (Array.isArray(choices)) {
          return null
        } else {
          return choices({ ...argsChoiceFn, searchText: text })
        }
      }, 500),
      []
    )

    // const fetchChoices = useCallback((text) => {
    //   if (Array.isArray(choices)) {
    //     return null
    //   } else {
    //     return choices({ ...argsChoiceFn, searchText: text })
    //   }
    // }, [])

    const onInputChange = (event, newValue) => {
      setSearchText(newValue)
      const result = fetchChoices(newValue)
      if (result) {
        Promise.resolve(result).then((value) => {
          console.log({ value })
          if (Array.isArray(value)) {
            setFinalChoices(value)
          }
        })
      }
      // const result = fetchChoices(newValue)
      // console.log({ result })
      // if (!isEmpty(result)) {
      //   result.then((value) => {
      //     console.log({ value })
      //     if (Array.isArray(value)) {
      //       setFinalChoices(value)
      //     }
      //   })
      //   // Promise.resolve(result).then((value) => {
      //   //   console.log({ value })
      //   //   if (Array.isArray(value)) {
      //   //     setFinalChoices(value)
      //   //   }
      //   // })
      // }
    }

    const onChange = (input) => (event, newValue) => {
      handleOnChange && handleOnChange(name, newValue, form)
      input.onChange(newValue)
    }
    console.log({ finalChoices })
    return (
      <Field name={name} validate={validate}>
        {({ input, meta }) => {
          let value = input?.value
          if (options?.multiple) {
            value = Array.isArray(value) ? value : []
          }

          // const options = typeof choices === "function" ? choices({ rowIdx, colIdx, column, record }) : choices;
          // const value = record[column.dataKey] || (allowEmpty || isEmpty(options[0]) ? null : options[0]?.id);

          return (
            <FormControl className={classes.formControl} style={{ width: options?.style?.width }} error={meta.touched && !!meta.error}>
              <Autocomplete
                // style={{ width }}
                value={value}
                onChange={onChange(input)}
                inputValue={searchText || value}
                onInputChange={onInputChange}
                // disabled={typeof disabled === "function" ? disabled({ rowIdx, colIdx, column, record }) : disabled}
                options={finalChoices.map((e) => e.id)}
                getOptionLabel={(option) => finalChoices.find((e) => e.id === option)?.name || ''}
                renderInput={(params) => <MuiTextField {...params} placeholder={options?.placeholder || 'Search'} />}
                // {...restProps}
              />

              {/* <Select
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
            </Select> */}

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

export default SelectInput

// export const AutoCompleteInput = React.memo(
//   ({ rowIdx, colIdx, column, record, onChange, choices, allowEmpty, width = 120, disabled, placeholder, ...restProps }) => {
//     const options = typeof choices === 'function' ? choices({ rowIdx, colIdx, column, record }) : choices
//     const value = record[column.dataKey] || (allowEmpty || isEmpty(options[0]) ? null : options[0]?.id)

//     return (
//       <Autocomplete
//         id='combo-box-demo'
//         style={{ width }}
//         value={value}
//         onChange={onChange && onChange({ rowIdx, colIdx, column, record })}
//         disabled={typeof disabled === 'function' ? disabled({ rowIdx, colIdx, column, record }) : disabled}
//         options={options.map((e) => e.id)}
//         getOptionLabel={(option) => options.find((e) => e.id === option)?.name || ''}
//         renderInput={(params) => <MuiTextField {...params} placeholder={placeholder} />}
//         {...restProps}
//       />
//     )
//   }
// )
