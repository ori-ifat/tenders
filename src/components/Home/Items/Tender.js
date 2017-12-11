import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../Home.scss'

const Tender = ({date, title, desc}) => {
  return    <div styleName="tender_wrapper">
    <div styleName="ten_date">
      <p data-font-size="16">{date}</p>
    </div>

    <div styleName="ten_cat">
      <p data-font-size="16">{title}</p>
    </div>

    <div styleName="ten_title">
      <p data-font-size="16">{desc}</p>
    </div>

  </div>
}

export default CSSModules(Tender, styles)
