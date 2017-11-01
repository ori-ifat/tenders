import React from 'react'
import { object, func, array } from 'prop-types'
import { observer } from 'mobx-react'
import ResultsItem from 'common/components/ResultsItem'
import find from 'lodash/find'
import CSSModules from 'react-css-modules'
import styles from './HomeList.scss'

@CSSModules(styles)
@observer
export default class HomeList extends React.Component {
  static propTypes = {
    item: object,
    onCheck: func,
    onFav: func,
    setReminder: func,
    checkedItems: object
  }

  render() {
    const { items, checkedItems, t } = this.props

    return (
      <div style={{marginBottom: '30px'}}>
        {items.map((item, index) => {
          const { checkedItems } = this.props
          const found = find(checkedItems, chk => {
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
        }, this)}
      </div>
    )
  }
}
