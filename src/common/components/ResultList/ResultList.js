import React from 'react'
import { inject, observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './ResultList.scss'
import InfiniteScroll from 'react-infinite-scroller'

@translate()
@inject('searchStore')
@CSSModules(styles)
@observer
export default class ResultList extends React.Component {

  //<div key={index} style={{height: '150px', border: 'magenta solid 1px'}}> {results[index].Title}</div>


  render() {
    const { t, searchStore } = this.props
    const { resultsPageSize, resultsLoading, results, hasMoreResults } = searchStore

    const items = results.map((item, index) =>
      <div key={index} style={{height: '150px', border: 'magenta solid 1px'}}> {item.Title}</div>
    )

    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={searchStore.loadNextResults}
        hasMore={hasMoreResults}
        loader={<div className="loader">Loading ...</div>}
      >
        {items}
      </InfiniteScroll>
    )
  }
}
