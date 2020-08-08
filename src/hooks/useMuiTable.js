import React from 'react'

import { getDistinctValues } from '../utils/helper'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy)
}

function applySort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const applyFilter = (rows, filterValues, idKey, hasIdKey) => {
  const dataKeys = Object.keys(filterValues)
  let filteredRows = rows.filter((row) => {
    let result = true
    for (let i = 0; i < dataKeys.length; i++) {
      const dataKey = dataKeys[i]
      const value = filterValues[dataKey]
      if (Array.isArray(value)) {
        if (value.length > 0) {
          const matchCount = value.filter((v) => v === row[dataKey]).length
          if (matchCount === 0) {
            result = false
            break
          }
        }
      } else {
        if (value !== row[dataKey]) {
          result = false
          break
        }
      }
    }
    return result || row.adding
  })

  if (hasIdKey) {
    const ids = getDistinctValues(filteredRows.map((row) => row[idKey]))
    return rows.filter((row) => ids.includes(row[idKey]))
  }

  return filteredRows
}

const applySearch = (rows, searchText, searchKeys, idKey, hasIdKey) => {
  if (!searchText) return rows
  let filteredRows = rows.filter((row) => {
    const match =
      searchKeys.filter((searchKey) => {
        let value = row[searchKey]
        if (value) {
          value = String(value).toLowerCase()
          return value.includes(searchText.trim().toLowerCase())
        }
        return false
      }).length > 0
    return match || row.adding
  })

  if (hasIdKey) {
    const ids = getDistinctValues(filteredRows.map((row) => row[idKey]))
    return rows.filter((row) => ids.includes(row[idKey]))
  }

  return filteredRows
}

const useMuiTable = (props) => {
  const {
    columns,
    searchKeys,
    selectable,
    sortable,
    pageable,
    idKey,
    inlineActions,
    rowInsert,
    rowAddCount,
    onSubmit,
    onSelectActionClick,
    onInlineActionClick,
    hasRowsChanged
  } = props

  const editableInline = inlineActions.findIndex((e) => e.name === 'edit' || e.name === 'add') !== -1

  const [editableState, setEditableState] = React.useState({
    editing: false,
    rowIdx: undefined, // Row being edited in case of inline editing or inline add/duplicate
    prevAction: undefined, // inline actions which are two step process, store prev action
    prevIdxx: undefined, // inline actions which are two step process, store prev idxx
    adding: false // add/duplicate is in progress
  })
  const [rows, setRows] = React.useState(props.rows)
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState(columns[0]?.dataKey)
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(props.pageSize)
  const [key, setKey] = React.useState(0) // To Reinitialize form if sorting changes
  const [filterValues, setFilterValues] = React.useState({})
  const [searchText, setSearchText] = React.useState('')

  const hasIdKey = rows.filter((row) => row.hasOwnProperty(idKey)).length > 0 // Check Whether idKey exists in rows
  const rowsChanged = hasRowsChanged(props.rows)
  const comparator = sortable ? getComparator(order, orderBy) : props.comparator

  /**
   * Store sorted rows data.
   * rows state will change on
   *    1. rows props is changed,
   *    2. sorting is changed
   */
  React.useEffect(() => {
    updateRows(props.rows)
  }, [rowsChanged, setRows])
  React.useEffect(() => {
    updateRows(rows)
  }, [order, orderBy, setRows])

  const updateRows = (rows) => {
    let rowList = applySort(rows, comparator)
    rowList = rowList.map((row, idx) => ({ ...row, idxx: idx * 2 }))
    setRows(rowList)
  }

  /*External handler functions */
  const handleSelectActionClick = (event, action) => {
    const selectedRows = rows.filter((row) => selected.includes(row[idKey]))
    const onActionComplete = () => setSelected([])
    onSelectActionClick && onSelectActionClick(event, action, selectedRows, onActionComplete)
  }

  const handleSubmit = (values, form, complete) => {
    const onSubmitComplete = (rowList) => {
      setEditableState({ editing: false })
      complete()
      if (rowList) {
        let updatedRows = [...rows]
        updatedRows.splice(page * pageSize, pageSize, ...rowList)
        updateRows(updatedRows)
      }
    }
    onSubmit && onSubmit(values?.rows, form, onSubmitComplete)
  }

  const handleInlineActionClick = (event, action, row, rowIdx) => {
    const onActionComplete = (rowOrRows) => {
      if (editableState.prevAction === 'edit') {
        if (rowOrRows) {
          setRows((rows) => {
            const idx = rows.findIndex((e) => e.idxx === editableState.prevIdxx)
            if (idx !== -1) {
              rows.splice(idx, 1, { ...rowOrRows, idxx: row.idxx })
            }
            return [...rows]
          })
        }
        setEditableState({ editing: false })
      } else if (editableState.prevAction === 'add' || editableState.prevAction === 'duplicate') {
        if (rowOrRows) {
          setRows((rows) => {
            const idx = rows.findIndex((e) => e.idxx === editableState.prevIdxx)
            if (idx !== -1) {
              rows.splice(idx, 1, { ...rowOrRows, adding: undefined })
            }
            return rows.map((row, idx) => ({ ...row, idxx: idx * 2 })) // update the idxx field
          })
        }
        setEditableState({ editing: false })
      } else if (action === 'delete') {
        let rowList = [...rows]
        if (Array.isArray(rowOrRows)) {
          rowList = rowOrRows
        } else {
          rowList = rowList.filter((e) => e.idxx !== row.idxx)
        }
        updateRows(rowList)
      }
    }

    if (action === 'edit') {
      setEditableState({ editing: true, rowIdx, prevAction: action, prevIdxx: row.idxx })
    } else if (action === 'add' || action === 'duplicate') {
      let newRow = action === 'duplicate' ? row : {}
      setRows((rows) => {
        const idx = rows.findIndex((e) => e.idxx === row.idxx)
        if (idx !== -1) {
          if (rowInsert === 'above') {
            rows.splice(idx, 0, { ...newRow, idxx: row.idxx - 1, adding: true })
          } else {
            rows.splice(idx + 1, 0, { ...newRow, idxx: row.idxx + 1, adding: true })
          }
        }
        return [...rows]
      })
      setEditableState({
        editing: true,
        rowIdx: rowInsert === 'above' ? rowIdx : rowIdx + 1,
        prevAction: action,
        prevIdxx: rowInsert === 'above' ? row.idxx - 1 : row.idxx + 1,
        adding: true
      })
    } else if (action === 'cancel') {
      if (editableState.prevAction === 'add' || editableState.prevAction === 'duplicated') {
        setRows((rows) => rows.filter((row) => row.idxx !== editableState.prevIdxx))
      }
      setEditableState({ editing: false })
    } else if (action === 'done') {
      const { idxx, adding, ...finalRow } = row
      onInlineActionClick && onInlineActionClick(event, editableState.prevAction, finalRow, onActionComplete)
    } else {
      onInlineActionClick && onInlineActionClick(event, action, row, onActionComplete)
    }
  }

  /*Internal Handler functions */
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setKey(key + 1)
  }

  const updateFilter = (dataKey, value) => {
    setFilterValues((prevValues) => ({ ...prevValues, [dataKey]: value }))
  }

  const resetFilter = () => {
    setFilterValues({})
  }

  const removeFilter = (dataKey, value) => {
    const prevValue = filterValues[dataKey]
    let newFilterValues = { ...filterValues }
    if (Array.isArray(prevValue)) {
      newFilterValues[dataKey] = prevValue.filter((e) => e !== value)
    } else {
      delete newFilterValues[dataKey]
    }
    setFilterValues(newFilterValues)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n[idKey])
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event, id) => {
    if (!selectable) return
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangePageSize = (event) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleRowAdd = (form) => {
    if (!form?.mutators) return
    for (let i = 0; i < rowAddCount; i++) {
      form.mutators.push('rows', {})
    }
  }

  // Filter & Sort
  let rowList = applyFilter(rows, filterValues, idKey, hasIdKey)
  rowList = applySearch(rowList, searchText, searchKeys, idKey, hasIdKey)

  // pagination
  const size = editableState.adding ? pageSize + 1 : pageSize
  const totalPage = rowList.length % size === 0 ? rowList.length / size : Math.ceil(rowList.length / size)
  const totalElements = rowList.length
  const startIdx = page * size
  const endIdx = pageable ? page * size + size : rowList.length
  rowList = rowList.slice(startIdx, endIdx)

  return {
    rowList,
    key,
    editableInline,
    editableState,
    page,
    pageSize,
    totalPage,
    totalElements,
    selected,
    order,
    orderBy,
    filterValues,
    setSearchText,
    setEditableState,
    handleSelectActionClick,
    handleSubmit,
    handleInlineActionClick,
    handleRequestSort,
    updateFilter,
    resetFilter,
    removeFilter,
    handleSelectAllClick,
    handleClick,
    handleChangePage,
    handleChangePageSize,
    handleRowAdd
  }
}

export default useMuiTable
