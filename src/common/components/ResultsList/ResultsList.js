import React from 'react'
import { object, func, array } from 'prop-types'
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

  static propTypes = {
    store: object,
    loadMore: func,
    onCheck: func,
    checkedItems: array
  }

  render() {
    const { t, store, loadMore, onCheck, checkedItems } = this.props
    const { resultsPageSize, resultsLoading, results, hasMoreResults } = store

    const items = results.map((item, index) => {
      //const tender = {TenderID: item.TenderID}
      //includes does not work, dont know why ...
      const checked = this.props.checkedItems.filter(chk => chk.TenderID == item.TenderID).length > 0
      return <Record
        key={index}
        item={item}
        onCheck={this.props.onCheck}
        checked={checked}
      />
    }, this)

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
