import { action, computed, observable, toJS } from 'mobx'
import isObject from 'lodash/isObject'
import map from 'lodash/map'
import filter from 'lodash/filter'
import moment from 'moment'
import {search} from 'common/services/apiService'

const serializeTags = ({ID, Name, ResType}) => {
  return ResType.indexOf('_partial') > -1 ? {
    id: Name,
    type: ResType
  } : {
    id: ID,
    type: ResType
  }
}

class Search {
  @observable filters = []; //chosen filters from filters component
  @observable availableFilters = [];  //all relevant filters;
  @observable tags = [];
  @observable sort = 'publishDate'
  @observable resultsLoading = false
  @observable hasMoreResults = true
  @observable request = {};
  @observable results = []
  @observable lastResultsPage = 0
  @observable resultsPageSize = 10
  @observable resultsCount = 0

  @computed
  get serializedTags() {
    let tags = toJS(this.tags)
    tags = map(tags, serializeTags)
    return JSON.stringify(tags)
  }

  //[{field:%20"TenderID",isAscending:%20true}]
  @computed
  get serializedSort() {
    let sort = toJS(this.sort)
    sort = [{field: sort, isAscending: false}]  //implement sort direction - from ui
    return JSON.stringify(sort)
  }

  @computed
  get serializedFilters() {
    const tags = toJS(this.tags)
    let filters = toJS(this.filters)  //[{values:[129], field:'city'}, {values:[40046], field:'publisher'}] //test
    const reduced = filter(tags, tag => {
      return tag.ResType ==  'tender_partial'
    })
    //add date filter if partial search was done, or no tags have beed added (empty search)
    if (reduced.length > 0 || (tags.length == 0 && filters.length == 0)) {
      const dateBack = moment().subtract(1, 'years').format('YYYY-MM-DD')
      const field = tags.length == 0 && filters.length == 0 ? 'publishdate' : 'inputdate'
      filters = [...filters, {field, values:[dateBack]}]
      //console.log('filters', filters)
    }
    return filters
  }

  @action.bound
  applySort(sort) {
    if (['infoDate', 'publishDate'].includes(sort)) {
      this.sort = sort
    } else {
      //implement error handle
      console.error('[searchStore]applySort', 'unknown sort value')
    }
  }

  @action.bound
  applyFilters(queryFilters) {
    const filters = JSON.parse(decodeURIComponent(queryFilters))
    if (isObject(filters)) {
      this.filters.replace(filters)
    } else {
      //implement error handle
      console.error('[searchStore]applyFilters', 'could not load filters from query')
    }
  }

  @action.bound
  applyTags(queryTags) {
    const tags = JSON.parse(decodeURIComponent(queryTags))
    if (isObject(tags)) {
      this.tags.replace(tags)
    } else {
      //implement error handle
      console.error('[searchStore]applyTags', 'could not load tags from query')
    }
  }

  @action.bound
  clearResults() {
    this.results.clear()
    this.lastResultsPage = 0
    this.hasMoreResults = true
    this.resultsCount = 0
  }

  @action.bound
  async loadNextResults() {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      const searchParams = {
        tags: this.serializedTags,
        filters: this.serializedFilters,  //toJS(this.filters),
        page: this.lastResultsPage + 1,
        pageSize: 10,
        sort: this.serializedSort
      }
      this.request = await search(searchParams)

      const {resultsPage: {data, total}, filtersMeta} = this.request
      if (data.length > 0) {
        this.lastResultsPage++
      }
      console.log('loadNextResults', this.lastResultsPage)
      this.results = [...this.results, ...data.map(d => ({ ...d, key: d.TenderID }))]
      this.availableFilters = filtersMeta
      //this.hasMoreResults = data.length === this.resultsPageSize
      this.resultsCount = total
      this.hasMoreResults = data.length > 0 && this.results.length < this.resultsCount
      this.resultsLoading = false
    }
  }
}

export const searchStore = new Search()
