import { action, computed, observable, toJS } from 'mobx'
import { getTender } from 'common/services/apiService'

class Item {
  @observable resultsLoading = false
  @observable item = {};

  @action.bound
  async loadTender(tenderID) {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      this.item = await getTender(tenderID)      
      this.resultsLoading = false
    }
  }
}

export const itemStore = new Item()
