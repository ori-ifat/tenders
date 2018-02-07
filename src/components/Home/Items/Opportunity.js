import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../Home.scss'

const Opportunity = ({title, desc, imgSrc}) => {
  return <div className="large-3 medium-6 columns">
    <div styleName="fet_wrapper">
      <img src={imgSrc} alt={title} />
      <h3 styleName="fet_ttl">{title}</h3>
      <p className="fet_desc">{desc}</p>
    </div>
  </div>
}

export default CSSModules(Opportunity, styles)
