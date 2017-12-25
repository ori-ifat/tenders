import React, {Component} from 'react'
import { func } from 'prop-types'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import { searchStore, recordStore } from 'stores'
import SearchInput from 'common/components/SearchInput'
import Title from 'common/components/Title'
import ResultsActions from './ResultsActions'
import List from 'common/components/List'
import Filters from './Filters'
import Banners from './Banners'
import NoData from 'components/NoData'
import CSSModules from 'react-css-modules'
import styles from './results.scss'

@withRouter
@whenRouted(({ params: { sort, tags, filters } }) => {
  searchStore.applySort(sort)
  searchStore.applyTags(tags)
  searchStore.clearFilterLabels()
  searchStore.applyFilters(filters)
  recordStore.cleanChecked()
  //searchStore.clearResults()
  searchStore.fromRoute = true  //raise route flag
  searchStore.loadNextResults()
  searchStore.loadNextFilters()
})
@inject('searchStore')
@inject('accountStore')
@inject('recordStore')
@CSSModules(styles)
@observer
export default class Results extends Component {

  static propTypes = {
    onCheck: func,
    onFav: func
  }

  render() {

    const {accountStore, searchStore, searchStore: {resultsLoading, resultsCount, tags}} = this.props
    const {onCheck, onFav} = this.props
    const {recordStore: {checkedItems}} = this.props
    const divStyle = resultsLoading && searchStore.fromRoute ? 'loading' : ''
    return (
      <div style={{marginTop: '50px'}}>
        <SearchInput tags={toJS(tags)} />
        <div>
          <Title store={searchStore} />
          <div className="grid-container">
            <div className="grid-x grid-padding-x">
              <div className="cell large-3">
                <hr />
                <Filters />
                {/*<Banners />*/}
              </div>
              <div className="cell large-9">
                <hr />
                {/*resultsLoading && <div>Loading...</div>*/}
                {resultsCount == 0 && !resultsLoading && <NoData error={searchStore.searchError} />}
                {resultsCount > 0 &&
                  <div styleName={divStyle}>
                    <ResultsActions />
                    <List
                      store={searchStore}
                      loadMore={searchStore.loadNextResults}
                      onCheck={onCheck}
                      onFav={onFav}
                      checkedItems={checkedItems} />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
