import { action, computed, observable, toJS } from 'mobx'
import {getAgentSettings, getSubSubjects} from 'common/services/apiService'

class SmartAgent {
  @observable resultsLoading = false
  @observable request = {};
  @observable results = []
  @observable searchError = null
  @observable query = null
  @observable subSubjectsLoading = false
  @observable subSubjects = []

  @action.bound
  async loadAgentSettings() {
    if (!this.resultsLoading) {
      this.resultsLoading = true
      this.searchError = null

      try {
        this.request = await getAgentSettings()
      }
      catch(e) {
        //an error occured on search
        this.searchError = {
          message: `[loadAgentSettings] search error: ${e.message} http status code ${e.error.status}`,
          statusCode: e.error.status
        }
      }

      if (this.searchError == null) {
        console.info('[loadAgentSettings]')
        this.results = this.request
      }
      else {
        console.error(this.searchError)
        this.results = []
      }
      this.resultsLoading = false
    }
  }

  @action.bound
  setCurrentQuery(query) {
    this.query = query
  }

  @action.bound
  async loadSubSubjects() {
    if (!this.subSubjectsLoading) {
      this.subSubjectsLoading = true
      let searchError = null

      try {
        this.subSubjects = await getSubSubjects()
      }
      catch(e) {
        //an error occured on search
        searchError = {
          message: `[loadSubSubjects] search error: ${e.message} http status code ${e.error.status}`,
          statusCode: e.error.status
        }
      }

      if (searchError == null) {
        console.info('[loadSubSubjects]')
      }
      else {
        console.error(searchError)
        this.subSubjects = []
      }
      this.subSubjectsLoading = false
    }
  }

}

export const smartAgentStore = new SmartAgent()
