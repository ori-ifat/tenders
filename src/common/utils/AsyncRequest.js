import {observable, autorun} from 'mobx'

export default class AsyncRequest {
  error = null;
  results;
  @observable loading = true;


  constructor(promise) {

    promise
      .then(res => {
        this.results = res
        this.loading = false
      })
      .catch(serverError => {
        const cause = serverError.error ? serverError.error.statusText : ''
        this.error = { message: serverError.message, cause }
        this.loading = false
      })
  }
}
