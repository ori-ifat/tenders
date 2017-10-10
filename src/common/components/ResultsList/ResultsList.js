import React from 'react'
import { observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './ResultsList.scss'
import InfiniteScroll from 'react-infinite-scroller'
import Record from 'common/components/Record'

@translate()
@CSSModules(styles)
@observer
export default class ResultsList extends React.Component {

  render() {
    const { t, store, loadMore } = this.props
    const { resultsPageSize, resultsLoading, results, hasMoreResults } = store

    const items = results.map((item, index) =>
      <Record key={index} item={item} />
    )

    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMoreResults}
        loader={<div>Loading...</div>}
      >
        {items}
      </InfiniteScroll>
    )
  }
}
