import { action, computed, observable, toJS } from 'mobx'
import { me, login, logout } from 'common/services/apiService'

class Account {

  @observable loading = false
  @observable profile = null

  constructor() {
    this.loadProfile()
  }

  @action.bound
  loadProfile() {
    //this.me = await me()
    me().then(profile => {
      this.profile = profile
      console.log('Me', this.profile)
    })
  }

  @action.bound
  login(userName, password, rememberMe) {
    return new Promise((resolve, reject) => {    
      login(userName, password, rememberMe).then(profile => {
        this.profile = profile
        console.log('login', this.profile)
        resolve()
      }).catch(error => {
        this.profile = null
      })
    })
  }

  @action.bound
  logout() {
    logout()
    //clean the userdata cookie
    document.cookie = 'UserData=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    this.profile = null
  }
}

export const accountStore = new Account()
