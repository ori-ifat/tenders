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
  @observable searchError = null
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
    this.searchError = null
    this.lastResultsPage = 0
    this.hasMoreResults = true
    this.resultsCount = 0
  }

  @action.bound
  async loadNextResults() {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      this.searchError = null
      const searchParams = {
        tags: this.serializedTags,
        filters: this.serializedFilters,  //toJS(this.filters),
        page: this.lastResultsPage + 1,
        pageSize: this.resultsPageSize,
        sort: this.serializedSort
      }

      try {
        this.request = await search(searchParams)
      }
      catch(e) {
        //an error occured on search
        this.searchError = {
          message: `[loadNextResults] search error: ${e.message} http status code ${e.error.status}`,
          statusCode: e.error.status
        }
      }

      if (this.searchError == null) {
        //if no errors occured, continue:
        const {resultsPage: {data, total}, filtersMeta} = this.request
        if (data.length > 0) {
          this.lastResultsPage++
        }
        console.info('[loadNextResults]', this.lastResultsPage)
        this.results = [...this.results, ...data.map(d => ({ ...d, key: d.TenderID }))]
        this.availableFilters = filtersMeta
        //this.hasMoreResults = data.length === this.resultsPageSize
        this.resultsCount = total
        this.hasMoreResults = data.length > 0 && this.results.length < this.resultsCount
      }
      else {
        //error handle.
        console.error(this.searchError) //a flag has been raised. implement what to do with it
        //set as there is no data (actually there is none...)
        this.results = []
        this.availableFilters = []
        this.resultsCount = 0
        this.hasMoreResults = false
      }
      this.resultsLoading = false
    }
  }
}

export const searchStore = new Search()
