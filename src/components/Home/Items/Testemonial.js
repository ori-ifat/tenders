import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../Home.scss'

const Testemonial = ({name, desc}) => {
  return  <div className="large-4 columns">
    <div className="tes_wrapper">
      <p>{desc}</p>
      <p styleName="tes_name">{name}</p>
    </div>
  </div>
}

export default CSSModules(Testemonial, styles)
