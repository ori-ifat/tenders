import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../Home.scss'

const Tender = ({date, title, desc}) => {
  return    <div styleName="tender_wrapper" data-font-size="16" data-font-size-type="px" data-line-height="24px">
    <div styleName="ten_date" data-font-size="16" data-font-size-type="px" data-line-height="24px">
      <p data-font-size="16" data-font-size-type="px" data-line-height="25.6px">{date}</p>
    </div>

    <div styleName="ten_cat" data-font-size="16" data-font-size-type="px" data-line-height="24px">
      <p data-font-size="16" data-font-size-type="px" data-line-height="25.6px">{title}</p>
    </div>

    <div styleName="ten_title" data-font-size="16" data-font-size-type="px" data-line-height="24px">
      <p data-font-size="16" data-font-size-type="px" data-line-height="25.6px">{desc}</p>
    </div>

  </div>
}

export default CSSModules(Tender, styles)
