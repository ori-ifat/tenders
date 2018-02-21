import remove from 'lodash/remove'
import moment from 'moment'

export function doFilter(store, field, values, itemLabels, close, closeModal, more) {
  if (field == 'publishdate' || field == 'infodate') {
    //special date handle: remove previous (or equivalent) if it was there
    remove(store.filters, filter => {
      return filter.field === 'publishdate' || filter.field === 'infodate'
    })
  }
  else {
    remove(store.filters, filter => {
      return filter.field === field
    })
  }
  //get current filters and concat new ones
  /*
  if (values.length == 0) values = [-999]   //add default to avoid search errors
  const newFilters = [...store.filters, {field, values}]  //concat new filter to previous filters
  //const newFilters = [{field, values}]  //seperate filters mode ... not used
  */
  //better:
  const newFilters = values.length > 0 ? [...store.filters, {field, values}] : store.filters
  const filters = JSON.stringify(newFilters)
  //apply filters to store, and commit search:
  store.applyFilters(filters)
  //store.clearResults()
  store.fromRoute = true  //raise route flag
  store.loadNextResults()
  //fix the labels for filter view
  if (close) {
    const labels = itemLabels.join(',')
    //onClose(field, labels)
    store.setSelectedFilters(field, labels, more)
    closeModal()   //close modal.
  }
}

export function getDefaultFilter(isEmpty, monthBack = 12) {
  //isEmpty = empty search (no tags)
  const dateBack = isEmpty ? moment().subtract(1, 'week').format('YYYY-MM-DD')
    : moment().subtract(monthBack, 'month').format('YYYY-MM-DD')
  //const field = isEmpty ? 'publishdate' : 'inputdate'
  const field = 'publishdate'
  return {field, values:[dateBack]}
}
