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

  onCheck = (checked, value) => {
    if (checked) {
      const item = { TenderID: value }
      if (!this.checkedItems.includes(item)) this.checkedItems.push(item)
    }
    else {
      remove(this.checkedItems, item => {
        return item.TenderID === value
      })
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
                  checkedItems={toJS(this.checkedItems)} />
              </div>
            </div>
            <Toolbar checkedItems={toJS(this.checkedItems)} />
          </div>
        }
      </div>
    )
  }
}
