import { action, computed, observable, toJS } from 'mobx'
import { me, login, logout } from 'common/services/apiService'

class Account {

  @observable loading = false
  @observable profile = null
  @observable error = null
  @observable errorMessage = null

  constructor() {
    this.loadProfile()
  }

  @action.bound
  loadProfile() {
    //this.me = await me()
    me().then(profile => {
      this.profile = profile
      //console.log('Me', this.profile)
    })
  }

  @action.bound
  async login(userName, password, rememberMe) {
    /*
    return new Promise((resolve, reject) => {
      login(userName, password, rememberMe).then(profile => {
        this.profile = profile
        this.error = null
        console.log('login', this.profile)
        resolve()
      }).catch(error => {
        this.error = error
        this.profile = null
      })
    })*/
    try {
      this.error = null
      this.errorMessage = null
      this.profile = await login(userName, password, rememberMe)
    }
    catch(e) {
      this.error = `[accountStore] login error: ${e.message} http status code ${e.error.status}`
      this.errorMessage = e.message   //friendly message returns from api
    }

    if (this.error != null) {
      console.error(this.error)
    }
  }

  @action.bound
  logout() {
    logout()
    //clean the userdata cookie
    document.cookie = 'UserData=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    this.error = null
    this.profile = null
  }
}

export const accountStore = new Account()
