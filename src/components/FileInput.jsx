import React from 'react'
import clsx from 'clsx'

import Dropzone from 'react-dropzone'

import { Field } from 'react-final-form'

import { makeStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'

import FileIcon from '@material-ui/icons/InsertDriveFile'
import DeleteIcon from '@material-ui/icons/Cancel'

const Preview = (props) => {
  const { className, onRemove, file, chipProps } = props
  return (
    <div className={className}>
      <Chip
        label={file?.name}
        icon={<FileIcon />}
        deleteIcon={<DeleteIcon />}
        variant='outlined'
        color='primary'
        component='a'
        clickable
        target='_blank'
        rel='noopener noreferrer'
        onDelete={() => onRemove && onRemove(file)}
        {...chipProps}
      />
    </div>
  )
}

const useStyles = makeStyles({
  dropzone: {
    backgroundColor: '#efefef',
    cursor: 'pointer',
    padding: '6px 12px',
    margin: 4,
    border: '1px dashed #888888',
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    width: '100%'
  },
  disabled: {
    backgroundColor: '#FBFBFB',
    border: '1px dashed rgba(150, 150, 150, .7)',
    color: 'rgba(150, 150, 150, 1)'
  }
})

const FileInput = React.memo(({ name, form, validate, disabled, variant, fontSize, options }) => {
  const classes = useStyles({ variant, fontSize })

  return (
    <Field name={name}>
      {({ input, meta }) => {
        const multiple = options?.multiple || false
        const value = input.value

        const onDrop = (acceptedFiles) => {
          const finalValue = multiple ? [...(value || []), ...acceptedFiles] : acceptedFiles[0]
          form.change(name, finalValue)
        }

        const onRemove = (file) => {
          if (multiple) {
            if (Array.isArray(value)) {
              form.change(
                name,
                value.filter((e) => e.name !== file?.name)
              )
            } else {
              form.change(name, [])
            }
          } else {
            form.change(name, null)
          }
        }

        return (
          <Dropzone onDrop={onDrop} {...options} multiple={multiple} disabled={disabled}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()} className={clsx(classes.dropzone, { [classes.disabled]: disabled })}>
                  <input {...getInputProps()} />
                  {Array.isArray(value) && value?.length > 0 ? (
                    value.map((file, idx) => <Preview key={idx} file={file} chipProps={options?.chipProps} onRemove={onRemove} />)
                  ) : value instanceof File ? (
                    <Preview file={value} chipProps={options?.chipProps} onRemove={onRemove} />
                  ) : (
                    <span>Choose File</span>
                  )}
                </div>
              </section>
            )}
          </Dropzone>
        )
      }}
    </Field>
  )
})

export default FileInput
