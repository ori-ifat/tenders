import { action, computed, observable, toJS } from 'mobx'
import { me } from 'common/services/apiService'

class Account {

  @observable me = {};
  @action.bound
  async loadProfile() {
    this.me = await me()
  }
}

export const accountStore = new Account()
