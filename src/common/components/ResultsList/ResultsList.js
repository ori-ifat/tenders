import React from 'react'
import { object, func, array } from 'prop-types'
import { observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './ResultsList.scss'
import InfiniteScroll from 'react-infinite-scroller'
//import Record from 'common/components/Record'
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
    checkedItems: object
  }

  render() {
    const { t, store, loadMore, onCheck, checkedItems } = this.props
    const { resultsPageSize, resultsLoading, results, hasMoreResults } = store

    const items = results.map((item, index) => {
      //const checked = this.props.checkedItems.filter(chk => chk.TenderID == item.TenderID).length > 0
      const found = find(this.props.checkedItems, chk => {
        return chk.TenderID == item.TenderID
      })

      const checked = found ? true : false
      const fav = found ? found.IsFavorite : item.IsFavorite
      /*return <Record
        key={index}
        item={item}
        onCheck={this.props.onCheck}
        onFav={this.props.onFav}
        checked={checked}
        fav={fav}
      />*/
      return <ResultsItem
        key={index}
        item={item}
        onClick={this.props.viewDetails}
        onCheck={this.props.onCheck}
        onFav={this.props.onFav}
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
