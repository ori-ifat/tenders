import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from './ResultsItemDetails.scss'

const Row = ({label, data}) => {
  return <div className="grid-x">
    <div className="medium-3 cell">
      <div styleName="item_lable">{label}</div>
    </div>
    <div className="medium-9 cell">
      <div styleName="item_key">{data} </div>
    </div>
  </div>
}

export default CSSModules(Row, styles, {allowMultiple: true})
