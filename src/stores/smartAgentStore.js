import { action, computed, observable, toJS } from 'mobx'
import {getAgentSettings, getSubSubjects, updateAgentSettings, isIfatUser} from 'common/services/apiService'

class SmartAgent {
  @observable resultsLoading = false
  @observable request = {};
  @observable results = []
  @observable searchError = null
  @observable subSubjectsLoading = false
  @observable subSubjects = []
  @observable settingsLoading = false
  @observable settingsData = -1
  @observable isIfat = {};
  @observable ifatUser = false
  @observable userDataLoading = false

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

  @action.bound
  async updateSettings(settings) {
    if (!this.settingsLoading) {
      this.settingsLoading = true
      let searchError = null

      try {
        this.settingsData = await updateAgentSettings(settings)
      }
      catch(e) {
        //an error occured on search
        searchError = {
          message: `[updateSettings] search error: ${e.message} http status code ${e.error.status}`,
          statusCode: e.error.status
        }
      }

      if (searchError == null) {
        console.info('[updateSettings]', this.settingsData)
      }
      else {
        console.error(searchError)
      }
      this.settingsLoading = false
    }
  }

  @action.bound
  async checkUser() {
    if (!this.userDataLoading) {
      this.userDataLoading = true
      let error = false

      try {
        this.isIfat = await isIfatUser()
      }
      catch(e) {
        //an error occured on search
        console.error(`[checkUser] search error: ${e.message} http status code ${e.error.status}`)
        error = true
      }

      if (!error) {
        console.info('[loadAgentSettings]')
        this.ifatUser = this.isIfat
      }
      else {
        this.ifatUser = false
      }
      this.userDataLoading = false
    }
  }

}

export const smartAgentStore = new SmartAgent()
