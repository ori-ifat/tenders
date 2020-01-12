import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../home.scss'

const Testemonial = ({name, desc}) => {
  return  <div className="large-4 medium-4 small-12 columns">
    <div className="tes_wrapper">
      <p>{desc}</p>
      <p styleName="tes_name">{name}</p>
    </div>
  </div>
}

export default CSSModules(Testemonial, styles)
