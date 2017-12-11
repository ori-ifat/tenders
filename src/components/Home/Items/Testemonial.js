import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../Home.scss'

const Testemonial = ({name, desc}) => {
  return  <div className="large-4 columns" data-font-size="16" data-font-size-type="px" data-line-height="24px">
    <div className="tes_wrapper" data-font-size="16" data-font-size-type="px" data-line-height="24px">
      <p data-font-size="16" data-font-size-type="px" data-line-height="25.6px">{desc}</p>
      <p styleName="tes_name" data-font-size="16" data-font-size-type="px" data-line-height="25.6px">{name}</p>
    </div>
  </div>
}

export default CSSModules(Testemonial, styles)
