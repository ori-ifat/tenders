import React from 'react'
import { object, func, array } from 'prop-types'
import { observer } from 'mobx-react'
import Record from 'common/components/Record'
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
    checkedItems: object
  }

  render() {
    const { items, onCheck, onFav, checkedItems, t } = this.props

    return (
      <div style={{marginBottom: '30px'}}>
        {items.map((item, index) => {
          const { checkedItems, onCheck } = this.props
          //const checked = checkedItems && checkedItems.filter(chk => chk.TenderID == item.TenderID).length > 0
          const found = find(checkedItems, chk => {
            return chk.TenderID == item.TenderID
          })
          const checked = found ? true : false
          const fav = found ? found.IsFavorite : item.IsFavorite
          return <Record
            key={index}
            item={item}
            onCheck={onCheck}
            onFav={onFav}
            checked={checked}
            fav={fav}
          />
        }, this)}
      </div>
    )
  }
}
