import React, {Component} from 'react'
import { func } from 'prop-types'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import {translate} from 'react-polyglot'
import { searchStore, recordStore } from 'stores'
import SearchInput from 'common/components/SearchInput'
import Title from 'common/components/Title'
import ResultsActions from './ResultsActions'
import List from 'common/components/List'
import Filters from './Filters'
import Banners from './Banners'
import NoData from 'components/NoData'
import filter from 'lodash/filter'
import DocumentMeta from 'react-document-meta'
import {getMetaData} from 'common/utils/meta'
import CSSModules from 'react-css-modules'
import styles from './results.scss'

@translate()
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

  getMeta = () => {
    const {searchStore, t} = this.props
    const tags = filter(searchStore.tags, tag => {
      return tag.ResType == 'subsubject'
    })

    let metaTitle = t('meta.homeTitle')
    let metaDesc = t('meta.homeDesc')
    let metaKW = t('meta.homeKeywords')
    if (tags.length == 1) {
      const tag = tags[0].Name
      metaTitle = t('meta.catResultsTitle', {tag})
      metaDesc = t('meta.catResultsDesc', {tag})
      metaKW = t('meta.catKeywords', {tag})
    }
    return getMetaData(metaTitle, metaDesc, metaKW)
  }

  render() {

    const {accountStore, searchStore, searchStore: {resultsLoading, resultsCount, tags}, t} = this.props
    const {onCheck, onFav} = this.props
    const {recordStore: {checkedItems}} = this.props
    const divStyle = resultsLoading && searchStore.fromRoute ? 'loading' : ''
    const meta = this.getMeta()

    //console.log('tags', toJS(tags))
    return (
      <div style={{marginTop: '50px'}}>
        <DocumentMeta {...meta} />
        <SearchInput tags={toJS(tags)} />
        <div>
          <Title store={searchStore} initial={searchStore.initialDate} />
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
