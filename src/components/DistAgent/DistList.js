import React, {Component, PropTypes} from 'react'
import ResultsItem from 'common/components/ResultsItem'
import CSSModules from 'react-css-modules'
import styles from './distagent.scss'

const DistList = ({catResults, checkedItems, allowCheck, onCheck, onFav}) => {
  return <div>
    {catResults.map((cat, index) => {
      return <div key={index}>
        <div styleName="cat">{cat.tendertype}</div>
        {
          cat.items.map((item, index) => {
            const found = find(checkedItems, chk => {
              return chk.TenderID == item.TenderID
            })
            const checked = found ? found.checked : false
            const fav = found ? found.IsFavorite : item.IsFavorite

            return <ResultsItem
              key={index}
              item={item}
              onCheck={allowCheck ? onCheck : undefined}
              onFav={onFav}
              checked={checked}
              fav={fav}
            />
          })
        }
      </div>
    })}
  </div>
}

export default CSSModules(DistList, styles)
