import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './TenderItem.scss'

const TenderItem = ({date, title, subSubject}) => {
  return <div styleName="tender_wrapper">
    <div styleName="ten_date">
      <p>{date}</p>
    </div>
    <div styleName="ten_cat">
      <p>{subSubject}</p>
    </div>
    <div styleName="ten_title">
      <p>{title}</p>
    </div>
  </div>
}

export default CSSModules(TenderItem, styles)
