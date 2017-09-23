import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './search.scss'

@CSSModules(styles)
export default class Search extends Component {

  componentWillMount = () => {
    console.log('search component')
  }

  render() {
    return (
      <div styleName="row">
        <div styleName="large-12">
          <div styleName="search-div" >
            Search - Component
          </div>
        </div>
      </div>
    )
  }
}
