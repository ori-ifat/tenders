import remove from 'lodash/remove'

export function doFilter(searchStore, field, values, itemLabels, onClose, open) {
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
  const newFilters = [...searchStore.filters, {field, values}]
  const filters = JSON.stringify(newFilters)
  //apply filters to store, and commit search:
  searchStore.applyFilters(filters)
  searchStore.clearResults()
  searchStore.loadNextResults()
  //fix the labels for filter view
  if (onClose) {
    const labels = itemLabels.join(',')
    onClose(field, labels)
    open = false   //close modal.
  }
}
