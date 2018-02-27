import remove from 'lodash/remove'
import filter from 'lodash/filter'
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
  //isEmpty = empty search (no tags)
  const dateBack = isEmpty ? moment().subtract(1, 'week').format('YYYY-MM-DD')
    : moment().subtract(1, 'year').format('YYYY-MM-DD')
  //const field = isEmpty ? 'publishdate' : 'inputdate'
  const field = 'publishdate'
  return {field, values:[dateBack]}
}

export function getDefaultDates(tags) {
  if (tags.length == 0) {
    //empty search handle
    return [moment().subtract(1, 'week').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
  }
  else {
    //check for the 'daysBack' tag:
    const reducedTags = filter(tags, tag => {
      return tag.ResType == 'daysBack'
    })
    if (reducedTags.length == 0) {
      //no daysBack, return 1 year back
      return [moment().subtract(1, 'year').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    }
    else {
      //check what was chosen. if more than one value, need to get the smallest one (=what api does)...
      let days = 0
      reducedTags.map(tag => {
        //initial value 0 or tag.ID is smaller: set value. note: tag.ID = days back.
        if (days == 0 || tag.ID < days) days = tag.ID
      })
      return [moment().subtract(days, 'day').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    }
  }
}
