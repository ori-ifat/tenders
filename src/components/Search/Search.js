import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './search.scss'
import SearchInput from 'common/components/SearchInput'
//import Test from 'components/Test'
import {inject} from 'mobx-react'

@CSSModules(styles)
export default class Search extends Component {

  render() {
    return (
      <div className="row">
        <div className="column large-12">
          <div styleName="search-div" >
            <SearchInput />
            {/*<Test />*/}
          </div>
        </div>
      </div>
    )
  }
}
