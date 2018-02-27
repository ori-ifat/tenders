import { action, computed, observable, toJS } from 'mobx'
import { mySearches } from 'common/services/apiService'

class Saved {
  @observable resultsLoading = false
  @observable searches = [];
  @observable searchError = null

  @action.bound
  async loadSavedSearches() {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      try {
        this.searches = await mySearches()
      }
      catch(e) {
        //an error occured on search
        this.searchError = {
          message: `[loadSavedSearches] error: ${e.message} http status code ${e.error.status}`,
          statusCode: e.error.status
        }
      }

      if (this.searchError == null) {
        console.info('[loadSavedSearches]')
      }
      else {
        console.error(toJS(this.searchError))
        this.item = {}
      }
      this.resultsLoading = false
    }
  }
}

export const savedStore = new Saved()
