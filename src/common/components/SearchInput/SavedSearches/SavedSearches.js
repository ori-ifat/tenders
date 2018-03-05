import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import {translate} from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './SavedSearches.scss'

@translate()
@inject('savedStore')
@inject('routingStore')
@observer
@CSSModules(styles)
export default class SavedSearches extends Component {

  componentWillMount() {
    const {savedStore} = this.props
    savedStore.loadSavedSearches()
  }
  /*
  componentWillReceiveProps(nextProps) {
    const {savedStore} = nextProps
    savedStore.loadSavedSearches()
  }*/

  goToSearch = (search) => {
    //console.log(toJS(search))
    const { routingStore } = this.props
    const sort = 'publishDate'  //default sort. note, means that on every search action, sort will reset here
    const payload = JSON.stringify(search)
    //note: on new search, filters should be empty
    routingStore.push(`/results/${sort}/${encodeURIComponent(payload)}/[]`)
  }

  pinItem = () => {
    console.log('pin')
  }

  deleteItem = () => {
    console.log('del')
  }

  render() {
    const {savedStore, savedStore: {resultsLoading}, t} = this.props
    console.log(toJS(savedStore.searches))
    return (
      <div className="row">
        <div className="medium-12 columns">
          <div styleName="container">
            <h3 styleName="title">{t('searches.title')}</h3>
            {
              !resultsLoading && savedStore.searches.map((search, index) => {
                let label = ''
                search.map(item => {label += `${item.Name}, `})
                label = label.substring(0, label.length - 2)
                return <div key={index} styleName="clearfix">
                  <div styleName="action-links">
                    <a styleName="image-buttons" className="image-pin" onClick={this.pinItem}>&nbsp;</a>
                    <a styleName="image-buttons" className="image-trash" onClick={this.deleteItem}>&nbsp;</a>
                  </div>
                  <div styleName="search-links">
                    <a onClick={() => this.goToSearch(search)} styleName="link">{label}</a>
                  </div>
                </div>
              })
            }
          </div>
        </div>
      </div>
    )
  }
}
