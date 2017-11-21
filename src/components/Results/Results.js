import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import { searchStore } from 'stores'
import SearchInput from 'common/components/SearchInput'
import ResultsTitle from './ResultsTitle'
import ResultsActions from './ResultsActions'
import ResultsList from './ResultsList'
import Filters from './Filters'
import Banners from './Banners'
import NoData from 'components/NoData'
import CSSModules from 'react-css-modules'
import styles from './results.scss'

@withRouter
@whenRouted(({ params: { sort, tags, filters } }) => {
  searchStore.applySort(sort)
  searchStore.applyTags(tags)
  searchStore.applyFilters(filters)
  searchStore.clearResults()
  searchStore.loadNextResults()
})
@inject('searchStore')
@inject('accountStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class Results extends Component {

  componentWillMount() {
    //console.log('mount')
  }

  componentWillReceiveProps(nextProps, nextState) {
    //console.log('receive props')
    //this.props.cleanChecked()
  }

  render() {

    const {accountStore, searchStore, searchStore: {resultsLoading, resultsCount, tags}} = this.props
    const {setSelectedFilters, selectedFilters, onCheck, onFav, viewDetails} = this.props
    const {checkedItems} = this.props

    return (
      <div style={{marginTop: '50px'}}>
        <SearchInput tags={toJS(tags)} />
        {resultsLoading && <div>Loading...</div>}
        {resultsCount == 0 && !resultsLoading && <NoData error={searchStore.searchError} />}
        {resultsCount > 0 &&
          <div>
            <ResultsTitle />
            <div className="row">
              <div className="columns large-3">
                <hr />
                <Filters
                  setSelected={setSelectedFilters}
                  selectedFilters={selectedFilters}
                />
                <Banners />
              </div>
              <div className="columns large-9">
                <hr />
                <ResultsActions />
                <ResultsList
                  store={searchStore}
                  loadMore={searchStore.loadNextResults}
                  onCheck={onCheck}
                  onFav={onFav}
                  viewDetails={viewDetails}
                  checkedItems={checkedItems} />
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}
