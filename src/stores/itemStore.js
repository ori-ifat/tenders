import { action, computed, observable, toJS } from 'mobx'
import { getTender } from 'common/services/apiService'

class Item {
  @observable resultsLoading = false
  @observable item = {};
  @observable searchError = null

  @action.bound
  async loadTender(tenderID) {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      try {
        this.item = await getTender(tenderID)
      }
      catch(e) {
        //an error occured on search
        this.searchError = {
          message: `[loadTender] error: ${e.message} http status code ${e.error.status}`,
          statusCode: e.error.status
        }
      }

      if (this.searchError == null) {
        console.info('[loadTender]', tenderID)
      }
      else {
        console.error(toJS(this.searchError))
        this.item = {}
      }
      this.resultsLoading = false
    }
  }
}

export const itemStore = new Item()
