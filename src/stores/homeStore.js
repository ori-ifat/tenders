import { action, computed, observable, toJS } from 'mobx'
import {getLastTenders, getBanners, getMoreTenders} from 'common/services/apiService'

class Home {
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
      const lastSeenTenderID = 7736041  //implementation needed - get lastSeenTenderID of logged customer
      const installedProductID = 112585 //implementation needed - get installedProductID from logged customer
      this.request = await getLastTenders(lastSeenTenderID, installedProductID)

      const data = this.request

      this.results = [...data.map(d => ({ ...d, key: d.TenderID }))]
      this.resultsCount = data.length
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
    const installedProductID = 112585 //implementation needed - get installedProductID from logged customer
    this.requestMore = await getMoreTenders(installedProductID)

    const data = this.requestMore
    this.resultsMore = [...data.map(d => ({ ...d, key: d.TenderID }))]
    this.resultsLoading = false    
  }
}

export const homeStore = new Home()
