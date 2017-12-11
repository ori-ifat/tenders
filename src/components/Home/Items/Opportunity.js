import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../Home.scss'

const Opportunity = ({title, desc, imgSrc}) => {
  return <div className="large-3 medium-6 columns" data-font-size="16" data-font-size-type="px" data-line-height="24px">
    <div styleName="fet_wrapper" data-font-size="16" data-font-size-type="px" data-line-height="24px">
      <img src={imgSrc} alt="" />
      <h3 styleName="fet_ttl" data-font-size="20" data-font-size-type="px" data-line-height="28px">{title}</h3>
      <p className="fet_desc" data-font-size="16" data-font-size-type="px" data-line-height="25.6px">{desc}</p>
    </div>
  </div>
}

export default CSSModules(Opportunity, styles)
