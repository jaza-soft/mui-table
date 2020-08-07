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
    return result
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
    return match
  })

  if (hasIdKey) {
    const ids = getDistinctValues(filteredRows.map((row) => row[idKey]))
    return rows.filter((row) => ids.includes(row[idKey]))
  }

  return filteredRows
}

const useMuiTable = (props) => {
  const { columns, rows, searchKeys, selectable, sortable, pageable, idKey, onSubmit, onSelectActionClick, onInlineActionClick } = props

  const [editing, setEditing] = React.useState(false)
  const [editingRowIdx, setEditingRowIdx] = React.useState() // Row being edited
  const [prevInlineAction, setPrevInlineAction] = React.useState() // inline actions which are two step process, store prev action
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState(columns[0]?.dataKey)
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(props.pageSize)
  const [key, setKey] = React.useState(0) // To Reinitialize form if sorting changes
  const [filterValues, setFilterValues] = React.useState({})
  const [searchText, setSearchText] = React.useState('')

  /*External handler functions */
  const handleSelectActionClick = (event, action) => {
    const selectedRows = rows.filter((row) => selected.includes(row[idKey]))
    const onActionComplete = () => setSelected([])
    onSelectActionClick && onSelectActionClick(event, action, selectedRows, onActionComplete)
  }

  const handleSubmit = (values, form, complete) => {
    const onSubmitComplete = () => {
      setEditing(false)
      complete()
    }
    onSubmit && onSubmit(values?.rows, form, onSubmitComplete)
  }

  const handleInlineActionClick = (event, action, row, rowIdx) => {
    const onActionComplete = (row) => {
      if (prevInlineAction === 'edit') {
        setEditing(false)
        setEditingRowIdx(undefined)
        setPrevInlineAction(undefined)
      }
    }
    if (action === 'edit') {
      setEditing(true)
      setEditingRowIdx(rowIdx)
      setPrevInlineAction(action)
    } else if (action === 'cancel') {
      setEditing(false)
      setEditingRowIdx(undefined)
      setPrevInlineAction(undefined)
    } else if (action === 'done') {
      onInlineActionClick && onInlineActionClick(event, prevInlineAction, row, onActionComplete)
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

  const hasIdKey = rows.filter((row) => row.hasOwnProperty(idKey)).length > 0 // Check Whether idKey exists in rows

  const comparator = sortable ? getComparator(order, orderBy) : props.comparator

  // Filter & Sort
  let rowList = applyFilter(rows, filterValues, idKey, hasIdKey)
  rowList = applySearch(rowList, searchText, searchKeys, idKey, hasIdKey)
  rowList = applySort(rowList, comparator)

  // pagination
  const totalPage = rowList.length % pageSize === 0 ? rowList.length / pageSize : Math.ceil(rowList.length / pageSize)
  const totalElements = rowList.length
  const startIdx = page * pageSize
  const endIdx = pageable ? page * pageSize + pageSize : rowList.length
  rowList = rowList.slice(startIdx, endIdx)

  return {
    key,
    rowList,
    editing,
    editingRowIdx,
    page,
    pageSize,
    totalPage,
    totalElements,
    selected,
    order,
    orderBy,
    filterValues,
    setSearchText,
    setEditing,
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
    handleChangePageSize
  }
}

export default useMuiTable
