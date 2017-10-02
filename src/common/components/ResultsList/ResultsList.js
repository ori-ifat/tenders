import React from 'react'
import { inject, observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './ResultsList.scss'
import InfiniteScroll from 'react-infinite-scroller'
import ResultsItem from 'common/components/ResultsItem'

@translate()
@inject('searchStore')
@CSSModules(styles)
@observer
export default class ResultsList extends React.Component {

  //<div key={index} style={{height: '150px', border: 'magenta solid 1px'}}> {results[index].Title}</div>
  /*<div key={index} style={{height: '150px', border: 'magenta solid 1px'}}> {item.Title}</div>*/

  render() {
    const { t, searchStore } = this.props
    const { resultsPageSize, resultsLoading, results, hasMoreResults } = searchStore

    const items = results.map((item, index) =>
      <ResultsItem key={index} item={item} />
    )

    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={searchStore.loadNextResults}
        hasMore={hasMoreResults}
        loader={<div>Loading...</div>}
      >
        {items}
      </InfiniteScroll>
    )
  }
}
