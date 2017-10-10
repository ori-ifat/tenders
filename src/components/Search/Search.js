import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './search.scss'
import SearchInput from 'components/SearchInput'
//import Test from 'components/Test'
import {inject} from 'mobx-react'

@CSSModules(styles, { allowMultiple: true })
export default class Search extends Component {

  render() {
    return (
      <div styleName="row">
        <div styleName="column large-12">
          <div styleName="search-div" >
            <SearchInput />
            {/*<Test />*/}
          </div>
        </div>
      </div>
    )
  }
}
