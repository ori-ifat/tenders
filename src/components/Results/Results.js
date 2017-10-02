import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import CSSModules from 'react-css-modules'
import styles from './results.scss'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import { searchStore } from 'stores'
import SearchInput from 'components/SearchInput'
import ResultsTitle from 'common/components/ResultsTitle'
import ResultsActions from 'common/components/ResultsActions'
import ResultsList from 'common/components/ResultsList'
import NoData from 'components/NoData'

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

  componentWillMount() {
    //console.log('results component', searchStore.sort, toJS(searchStore.tags))
  }

  render() {

    const {searchStore: {resultsCount}} = this.props

    return (
      <div style={{marginTop: '50px'}}>
        <SearchInput sort="infoDate" />
        {resultsCount == 0 && <NoData />}
        {resultsCount > 0 &&
          <div>
            <ResultsTitle />
            <div styleName="row">
              <div styleName="columns large-3">
                <hr />
              </div>
              <div styleName="columns large-9">
                <hr />
                <ResultsActions sort="infoDate" />
                <ResultsList />
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}
