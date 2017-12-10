import { action, computed, observable, toJS } from 'mobx'
import {getLastTenders, getBanners, getMoreTenders} from 'common/services/apiService'

class Main {
  @observable resultsLoading = false
  @observable request = {};
  @observable results = []
  @observable requestMore = {};
  @observable resultsMore = []
  @observable resultsCount = 0
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
