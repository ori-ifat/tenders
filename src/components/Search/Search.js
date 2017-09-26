import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './search.scss'
import SearchInput from 'components/SearchInput'
import Test from 'components/Test'
import {inject, observer} from 'mobx-react'

@inject('routingStore')
//@observer
@CSSModules(styles)
export default class Search extends Component {

  componentWillMount = () => {
    console.log('search component')
  }

  render() {
    const {routingStore: {location}} = this.props
    return (
      <div styleName="row">
        <div styleName="large-12">
          <div styleName="search-div" >
            <SearchInput location={location} />
            {/*<Test />*/}
          </div>
        </div>
      </div>
    )
  }
}
