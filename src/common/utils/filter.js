export function doFilter(searchStore, field, values, itemLabels, onClose, open) {
  //get current search params
  const sort = searchStore.sort
  const payload = JSON.stringify(searchStore.tags)
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
