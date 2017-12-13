import remove from 'lodash/remove'
import moment from 'moment'

export function doFilter(searchStore, field, values, itemLabels, close, closeModal, more) {
  //get current search params
  const sort = searchStore.sort
  const payload = JSON.stringify(searchStore.tags)
  if (field == 'publishdate' || field == 'infodate') {
    //special date handle: remove previous (or equivalent) if it was there
    remove(searchStore.filters, filter => {
      return filter.field === 'publishdate' || filter.field === 'infodate'
    })
  }
  else {
    remove(searchStore.filters, filter => {
      return filter.field === field
    })
  }
  //get current filters and concat new ones
  /*
  if (values.length == 0) values = [-999]   //add default to avoid search errors
  const newFilters = [...searchStore.filters, {field, values}]  //concat new filter to previous filters
  //const newFilters = [{field, values}]  //seperate filters mode ... not used
  */
  //better:
  const newFilters = values.length > 0 ? [...searchStore.filters, {field, values}] : searchStore.filters
  const filters = JSON.stringify(newFilters)
  //apply filters to store, and commit search:
  searchStore.applyFilters(filters)
  //searchStore.clearResults()
  searchStore.fromRoute = true  //raise route flag
  searchStore.loadNextResults()
  //fix the labels for filter view
  if (close) {
    const labels = itemLabels.join(',')
    //onClose(field, labels)
    searchStore.setSelectedFilters(field, labels, more)
    closeModal()   //close modal.
  }
}

export function getDefaultFilter(isEmpty) {
  const dateBack = moment().subtract(1, 'years').format('YYYY-MM-DD')
  const field = isEmpty ? 'publishdate' : 'inputdate'
  return {field, values:[dateBack]}
}
