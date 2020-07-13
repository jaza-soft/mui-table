import React from 'react'
import { Field } from 'react-final-form'

const TextInput = ({ name, label, validate }) => {
  return (
    <Field name={name} validate={validate}>
      {({ input, meta }) => {
        return (
          <div>
            <label>{label}</label>
            <input {...input} placeholder={label} />
            {meta.touched && meta.error && <span>{meta.error}</span>}
          </div>
        )
      }}
    </Field>
  )
}

export default TextInput
