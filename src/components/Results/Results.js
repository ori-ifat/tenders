import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import CSSModules from 'react-css-modules'
import styles from './results.scss'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import { searchStore } from 'stores'
import SearchInput from 'components/SearchInput'
import ResultsTitle from './ResultsTitle'
import ResultsActions from './ResultsActions'
import ResultsList from 'common/components/ResultsList'
import Toolbar from 'common/components/Toolbar'
import NoData from 'components/NoData'
import remove from 'lodash/remove'
import find from 'lodash/find'

@withRouter
@whenRouted(({ params: { sort, tags } }) => {
  searchStore.applySort(sort)
  searchStore.applyTags(tags)
  searchStore.clearResults()
  searchStore.loadNextResults()
})
@inject('searchStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class Results extends Component {

  @observable checkedItems = []

  componentWillMount() {
    //console.log('mount')
  }

  componentWillReceiveProps(nextProps, nextState) {
    //console.log('receive props')
    this.checkedItems = []
  }

  onCheck = (checked, value, isFavorite) => {
    //note duplicate code with home.js . implement: util
    if (checked) {
      const found = find(this.checkedItems, item => {
        return item.TenderID == value
      })
      if (!found) this.checkedItems.push({ TenderID: value, IsFavorite: isFavorite })
    }
    else {
      remove(this.checkedItems, item => {
        return item.TenderID === value
      })
    }
    //console.log(this.checkedItems)
  }

  onFav = (tenderID, add) => {
    console.log('onFav', tenderID, add)
    //implement: call api with item and relevant action (add\!add)
    const found = find(this.checkedItems, item => {
      return item.TenderID == tenderID && item.IsFavorite != add
    })
    if (found) {
      //if item is in checkedItems array, need to update its fav state
      remove(this.checkedItems, item => {
        return item.TenderID === tenderID
      })
      //add the item again with new fav state
      this.checkedItems.push({ TenderID: tenderID, IsFavorite: add })
      //console.log('onFav', toJS(this.checkedItems))
    }
  }

  render() {

    const {searchStore, searchStore: {resultsLoading, resultsCount, tags}} = this.props
    return (
      <div style={{marginTop: '50px'}}>
        <SearchInput tags={toJS(tags)} />
        {resultsLoading && <div>Loading...</div>}
        {resultsCount == 0 && !resultsLoading && <NoData />}
        {resultsCount > 0 &&
          <div>
            <ResultsTitle />
            <div styleName="row">
              <div styleName="columns large-3">
                <hr />
              </div>
              <div styleName="columns large-9">
                <hr />
                <ResultsActions />
                <ResultsList
                  store={searchStore}
                  loadMore={searchStore.loadNextResults}
                  onCheck={this.onCheck}
                  onFav={this.onFav}
                  checkedItems={this.checkedItems} />
              </div>
            </div>
            <Toolbar checkedItems={this.checkedItems} />
          </div>
        }
      </div>
    )
  }
}
