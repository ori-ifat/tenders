import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
//import {observable, toJS} from 'mobx'
import { withRouter } from 'react-router'
import { whenRouted } from 'common/utils/withRouteHooks'
import { agentStore, recordStore } from 'stores'
import SearchInput from 'common/components/SearchInput'
import Title from 'common/components/Title'
import List from 'common/components/List'
import AgentFilters from './AgentFilters'
//import {translate} from 'react-polyglot'

import CSSModules from 'react-css-modules'
import styles from './agentresults.scss'

//@translate()
@withRouter
@whenRouted(({ params: { filters } }) => {
  //searchStore.applySort(sort)
  agentStore.clearFilterLabels()
  agentStore.applyFilters(filters)
  recordStore.cleanChecked()
  agentStore.clearResults()
  agentStore.fromRoute = true  //raise route flag
  agentStore.loadNextResults()
  agentStore.loadNextFilters()
})
@inject('agentStore')
@inject('accountStore')
@inject('recordStore')
@CSSModules(styles)
@observer
export default class AgentResults extends Component {

  componentWillMount() {

  }

  render() {
    const {/*accountStore,*/ agentStore, agentStore: {resultsLoading, resultsCount, fromRoute}} = this.props
    const {onCheck, onFav} = this.props
    const {recordStore: {checkedItems}} = this.props
    const divStyle = resultsLoading && fromRoute ? 'loading' : ''

    return (
      <div style={{marginTop: '50px'}}>
        <SearchInput />
        <div>
          <Title
            mode="agent"
            store={agentStore}
          />
          <div className="grid-container">
            <div className="grid-x grid-padding-x">
              <div className="cell large-3">
                <hr />
                <AgentFilters />
                {/*<Banners />*/}
              </div>
              <div className="cell large-9">
                <hr />
                {/*resultsLoading && <div>Loading...</div>*/}
                {resultsCount == 0 && !resultsLoading && <NoData error={agentStore.searchError} />}
                {resultsCount > 0 &&
                  <div styleName={divStyle}>
                    {/*<ResultsActions />*/}
                    <List
                      store={agentStore}
                      loadMore={agentStore.loadNextResults}
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
