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

  render() {
    const {savedStore, savedStore: {resultsLoading}, t} = this.props
    //console.log(toJS(savedStore.searches))
    return (
      <div className="row">
        <div className="medium-12 columns">
          <div styleName="container">
            <h1 styleName="title">{t('searches.title')}</h1>
            {
              !resultsLoading && savedStore.searches.map((search, index) =>
                <div key={index}>
                  <a onClick={() => this.goToSearch(search)} styleName="link">&larr; {
                    search.map(item => `${item.Name}, `)
                  }</a>
                </div>
              )
            }
          </div>
        </div>
      </div>
    )
  }
}
