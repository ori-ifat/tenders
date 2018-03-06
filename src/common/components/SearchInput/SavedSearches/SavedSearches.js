import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import {translate} from 'react-polyglot'
import remove from 'lodash/remove'
import { saveSearch, unSaveSearch, delSearch } from 'common/services/apiService'
//import Loading from 'common/components/Loading/Loading'
import CSSModules from 'react-css-modules'
import styles from './SavedSearches.scss'

@translate()
@inject('savedStore')
@inject('routingStore')
@observer
@CSSModules(styles)
export default class SavedSearches extends Component {

  @observable pinned = []

  componentWillMount() {
    this.loadSearches()
  }
  /*
  componentWillReceiveProps(nextProps) {
    const {savedStore} = nextProps
    savedStore.loadSavedSearches()
  }*/

  loadSearches = () => {
    const {savedStore} = this.props
    savedStore.loadSavedSearches().then(() => {
      savedStore.searches.map((query) => {
        if(query.Saved && !this.pinned.includes(query.ID)) this.pinned.push(query.ID)
      })
    })
  }
  goToSearch = (query) => {
    //console.log(toJS(search))
    const { routingStore } = this.props
    const sort = 'publishDate'  //default sort. note, means that on every search action, sort will reset here
    const payload = JSON.stringify(query.Search)
    //note: on new search, filters should be empty
    routingStore.push(`/results/${sort}/${encodeURIComponent(payload)}/[]`)
  }

  pinItem = (id, pin) => {
    //const {savedStore} = this.props
    if (pin) {
      saveSearch(id).then(() => {
        console.log('pinned', id)
        if (!this.pinned.includes(id)) this.pinned.push(id)
      }, this)
    }
    else {
      unSaveSearch(id).then(() => {
        console.log('unpinned', id)
        remove(this.pinned, item => {
          return item === id
        })
      }, this)
    }
    //console.log('pin', toJS(this.pinned), pin)
  }

  deleteItem = (id) => {
    const {savedStore} = this.props
    savedStore.deleteSearch(id).then(() => {
      console.log('deleted', id)
      remove(this.pinned, item => {
        return item === id
      })
      this.loadSearches()
    }, this)
    //console.log('del', id)
  }

  render() {
    const {savedStore, savedStore: {resultsLoading}, t} = this.props
    //console.log(toJS(savedStore.searches))
    return (
      <div className="row">
        <div className="medium-12 columns">
          <div styleName="container">
            <h3 styleName="title">{t('searches.title')}</h3>
            {
              !resultsLoading && savedStore.searches.map((query, index) => {
                let label = ''
                query.Search.map(item => {label += `${item.Name}, `})
                label = label.substring(0, label.length - 2)
                const isPinned = this.pinned.includes(query.ID)
                //if (isPinned && !this.pinned.includes(query.ID)) this.pinned.push(query.ID)
                const pinnedStyle = isPinned ? 'pinned' : 'image-pin'
                return <div key={index} styleName="clearfix">
                  <div styleName="action-links">
                    <a styleName="image-buttons" className={pinnedStyle} onClick={() => this.pinItem(query.ID, !isPinned)}>&nbsp;</a>
                    <a styleName="image-buttons" className="image-trash" onClick={() => this.deleteItem(query.ID)}>&nbsp;</a>
                  </div>
                  <div styleName="search-links">
                    <a onClick={() => this.goToSearch(query)} styleName="link">{label}</a>
                  </div>
                </div>
              })
            }
            {
              resultsLoading && <div style={{height:'188px'}}>&nbsp;</div>
            }
          </div>
        </div>
      </div>
    )
  }
}
