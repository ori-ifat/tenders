import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './search.scss'
import SearchInput from 'components/SearchInput'
//import Test from 'components/Test'
import {inject} from 'mobx-react'

@inject('routingStore')
@CSSModules(styles)
export default class Search extends Component {

  componentWillMount = () => {
    //console.log('search component')
  }

  render() {
    const {routingStore: {location}} = this.props
    return (
      <div styleName="row">
        <div styleName="large-12">
          <div styleName="search-div" >
            <SearchInput sort="infoDate" />
            {/*<Test />*/}
          </div>
        </div>
      </div>
    )
  }
}
