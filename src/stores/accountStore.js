import { action, computed, observable, toJS } from 'mobx'
import { me } from 'common/services/apiService'

class Account {

  @observable me = {};
  @action.bound
  async loadProfile() {
    //this.me = await me()
    await me().then(profile => {
      this.me = profile
      console.log('Me', this.me)
    })
  }
}

export const accountStore = new Account()
