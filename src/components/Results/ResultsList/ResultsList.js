import React from 'react'
import { object, func, array } from 'prop-types'
import { observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './ResultsList.scss'
import InfiniteScroll from 'react-infinite-scroller'
import ResultsItem from 'common/components/ResultsItem'
import find from 'lodash/find'

@translate()
@CSSModules(styles)
@observer
export default class ResultsList extends React.Component {

  static propTypes = {
    store: object,
    loadMore: func,
    onCheck: func,
    onFav: func,
    viewDetails: func,
    setReminder: func,
    checkedItems: object
  }

  render() {
    const { t, store, loadMore, checkedItems } = this.props
    const { resultsPageSize, resultsLoading, results, hasMoreResults } = store

    const items = results.map((item, index) => {
      const found = find(this.props.checkedItems, chk => {
        return chk.TenderID == item.TenderID
      })

      const checked = found ? true : false
      const fav = found ? found.IsFavorite : item.IsFavorite

      return <ResultsItem
        key={index}
        item={item}
        onClick={this.props.viewDetails}
        onCheck={this.props.onCheck}
        onFav={this.props.onFav}
        setReminder={this.props.setReminder}
        checked={checked}
        fav={fav}
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
