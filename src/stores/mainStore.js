import { action, computed, observable, toJS } from 'mobx'
import {getAgentResults, getLastTenders, getBanners, getMoreTenders} from 'common/services/apiService'

class Main {
  @observable resultsLoading = false
  @observable request = {};
  @observable results = []
  @observable requestMore = {};
  @observable resultsMore = []
  @observable lastResultsPage = 0
  @observable resultsPageSize = 10
  @observable resultsCount = 0
  @observable hasMoreResults = true
  @observable banner = {};

  @action.bound
  async loadAgentResults() {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      const lastSeenTenderID = -1  //future implementation - get lastSeenTenderID of logged customer
      let error = null  //if needed, make an observable
      try {
        this.request = await getLastTenders(lastSeenTenderID)
      }
      catch(e) {
        //an error occured on search
        console.error(`[loadAgentResults] search error: ${e.message} http status code ${e.error.status}`)
        error = e.message
      }

      if (error == null) {
        const data = this.request

        this.results = [...data.map(d => ({ ...d, key: d.TenderID }))]
        this.resultsCount = data.length
      }
      else {
        this.results = []
        this.resultsCount = 0
      }
      this.resultsLoading = false
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
  async loadAgentResults2() {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      let searchError = null

      const searchParams = {
        page: this.lastResultsPage + 1,
        pageSize: this.resultsPageSize
      }

      try {
        this.request = await getAgentResults(searchParams)
      }
      catch(e) {
        //an error occured on search
        searchError = {
          message: `[loadAgentResults2] search error: ${e.message} http status code ${e.error.status}`,
          statusCode: e.error.status
        }
      }

      if (searchError == null) {
        //if no errors occured, continue:
        //const {resultsPage: {data, total}, filtersMeta} = this.request
        const {data, total} = this.request
        if (data.length > 0) {
          this.lastResultsPage++
        }
        this.results = [...this.results, ...data.map(d => ({ ...d, key: d.TenderID }))]
        //this.resultsCount = total   //total returns 0 from that api
        this.resultsCount = data.length
        //this.hasMoreResults = data.length > 0 && this.results.length < this.resultsCount
        this.hasMoreResults = !(data.length == 0 || data.length < this.resultsPageSize) //use that because total returns 0,
        console.info('[loadAgentResults2]', this.lastResultsPage, this.hasMoreResults)
      }
      else {
        //error handle.
        console.error(searchError) //a flag has been raised. implement what to do with it
        //set as there is no data (actually there is none...)
        this.results = []
        //this.availableFilters = []
        this.resultsCount = 0
        this.hasMoreResults = false
      }
      this.resultsLoading = false
    }
  }

  @action.bound
  async getBanner() {
    this.banner = await getBanners()
  }

  @action.bound
  async loadMoreTenders() {
    this.resultsLoading = true
    this.requestMore = await getMoreTenders()

    const data = this.requestMore
    this.resultsMore = [...data.map(d => ({ ...d, key: d.TenderID }))]
    this.resultsLoading = false
  }
}

export const mainStore = new Main()
