import React, {Component} from 'react'
import {getData} from 'common/services/apiService'
import AsyncRequest from 'common/utils/AsyncRequest'
import {observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import CSSModules from 'react-css-modules'
import styles from './results.scss'

@CSSModules(styles)
@observer
export default class Results extends Component {

  @observable request = {};

  componentWillMount() {
    console.log('results component')
    this.request = new AsyncRequest(getData(458411))  //Test...
  }

  render() {
    if (this.request.error) {
      return <div>Error</div>
    }

    if (this.request.loading) {
      return <div>Loading</div>
    }

    console.log(toJS(this.request))

    const {results} = this.request

    return (
      <div style={{marginTop: '50px'}}>
        Results - Component
        {
          results.map((item, index) =>
            <div key={index}>{item.Title} - {item.Publisher} - {item.TenderType}</div>
          )
        }
      </div>
    )
  }
}
