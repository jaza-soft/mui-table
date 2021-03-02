import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import CardHeader from '@material-ui/core/CardHeader'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

import { MuiTable } from '@jazasoft/mui-table'

const options = {
  style: {
    margin: '0.5em 0',
    width: 175
  }
}

const columns = [
  {
    dataKey: 'flat',
    title: 'Flat'
    // inputType: 'text-input',
    // options
  },
  {
    dataKey: 'street',
    title: 'Street',
    inputType: 'text-input',
    options
  },
  {
    dataKey: 'city',
    title: 'City',
    inputType: 'text-input',
    options
  },
  {
    dataKey: 'pin',
    title: 'PIN',
    inputType: 'text-input',
    options
  }
]

const useStyles = makeStyles((theme) => ({
  root: {},
  cardContent: {
    '& > *': {
      margin: theme.spacing(1),
      width: '40ch'
    }
  },
  mrVertical: {
    marginTop: '1.5em'
  }
}))

const EditableTableExtSubmit = () => {
  const classes = useStyles()

  const [user, setUser] = React.useState({ addressList: [{ flat: 'Venkatas Grassland Apartment' }] })

  const onSubmit = (values, form, onSubmitComplete) => {
    const updatedUser = { ...user, addressList: values }
    console.log({ user: updatedUser })
    onSubmitComplete && onSubmitComplete(values)
  }

  const onChange = (event) => {
    const name = event?.target?.name
    const value = event?.target?.value
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  let handleSubmit
  const handleSubmitRef = (submit) => {
    handleSubmit = submit
  }

  return (
    <div>
      <form className={classes.root} noValidate autoComplete='off'>
        <Card variant='outlined'>
          <CardHeader title='Basic Details' />
          <Divider />
          <CardContent className={classes.cardContent}>
            <TextField name='firstName' label='First Name' value={user.firstName || ''} onChange={onChange} />
            <TextField name='lastName' label='Last Name' value={user.lastName || ''} onChange={onChange} />
            <TextField name='email' label='Email' value={user.email || ''} onChange={onChange} />
            <TextField name='mobile' label='Mobile' value={user.mobile || ''} onChange={onChange} />
          </CardContent>
        </Card>

        <Card className={classes.mrVertical} variant='outlined'>
          <CardHeader title='Address' />
          <Divider />
          <MuiTable
            handleSubmitRef={handleSubmitRef}
            component='div'
            columns={columns}
            rows={user.addressList}
            editable={true}
            editing={true}
            enableRowAddition={true}
            onSubmit={onSubmit}
          />
        </Card>

        <div style={{ marginTop: 32 }}>
          <Button variant='contained' color='primary' type='submit' onClick={(event) => handleSubmit(event)}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditableTableExtSubmit
