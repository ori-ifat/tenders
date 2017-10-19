import React from 'react'
import { object, func, array } from 'prop-types'
import { observer } from 'mobx-react'
import Record from 'common/components/Record'
import CSSModules from 'react-css-modules'
import styles from './HomeList.scss'

@CSSModules(styles)
@observer
export default class HomeList extends React.Component {
  static propTypes = {
    item: object,
    onCheck: func,
    checkedItems: array
  }

  render() {
    const { items, onCheck, checkedItems, t } = this.props

    return (
      <div style={{marginBottom: '30px'}}>
        {items.map((item, index) => {
          const { checkedItems, onCheck } = this.props
          const checked = checkedItems && checkedItems.filter(chk => chk.TenderID == item.TenderID).length > 0
          return <Record
            key={index}
            item={item}
            onCheck={onCheck}
            checked={checked}
          />
        }, this)}
      </div>
    )
  }
}
