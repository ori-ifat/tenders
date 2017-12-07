import React, {Component} from 'react'
import { object, func } from 'prop-types'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import { favoritesStore } from 'stores'
import SearchInput from 'common/components/SearchInput'
import Title from 'common/components/Title'
//import ResultsActions from 'components/Results/ResultsActions'
import List from 'common/components/List'
import NoData from 'components/NoData'
import CSSModules from 'react-css-modules'
import styles from './favorites.scss'

@withRouter
@whenRouted(({ params: { sort, tags, filters } }) => {
  favoritesStore.clearResults()
  favoritesStore.loadNextResults()
})
@inject('favoritesStore')
@inject('accountStore')
@inject('recordStore')
@CSSModules(styles)
@observer
export default class Favorites extends Component {

  static propTypes = {
    onCheck: func,
    onFav: func
  }  

  render() {

    const {accountStore, favoritesStore, favoritesStore: {resultsLoading, resultsCount, tags}} = this.props
    const {onCheck, onFav, recordStore: {checkedItems}} = this.props

    return (
      <div style={{marginTop: '50px'}}>
        <SearchInput tags={toJS(tags)} />
        {resultsLoading && <div>Loading...</div>}
        {resultsCount == 0 && !resultsLoading && <NoData error={favoritesStore.searchError} />}
        {resultsCount > 0 &&
          <div>
            <Title mode="favorites" store={favoritesStore} />
            <div className="row">
              <div className="columns large-12">
                <hr />
                {/*<ResultsActions />*/}
                <List
                  store={favoritesStore}
                  loadMore={favoritesStore.loadNextResults}
                  onCheck={onCheck}
                  onFav={onFav}
                  checkedItems={checkedItems} />
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}
