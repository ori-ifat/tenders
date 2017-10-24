import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import { searchStore } from 'stores'
import SearchInput from 'components/SearchInput'
import ResultsTitle from './ResultsTitle'
import ResultsActions from './ResultsActions'
import ResultsList from 'common/components/ResultsList'
import Toolbar from 'common/components/Toolbar'
import NoData from 'components/NoData'
import {setCheckedStatus, setFavStatus} from 'common/utils/util'
import {addToFavorites, clearCache} from 'common/services/apiService'
import CSSModules from 'react-css-modules'
import styles from './results.scss'

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
    console.log('onCheck', checked, value, isFavorite)
    setCheckedStatus(this.checkedItems, checked, value, isFavorite)
    console.log(this.checkedItems)
  }

  onFav = (tenderID, add) => {
    //console.log('onFav', tenderID, add)
    //call api with item and relevant action (add\!add)
    const action = add ? 'Favorite_add' : 'Favorite_del'
    addToFavorites(action, [tenderID])
    clearCache()
    setFavStatus(this.checkedItems, tenderID, add)
    //console.log(this.checkedItems)
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
