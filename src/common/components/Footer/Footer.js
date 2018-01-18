import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from './Footer.scss'

const Footer = ({rights, service}) => {
  return  <footer styleName="footer">
    <div className="row">
      <div className="medium-6 columns">
        <p>{rights}</p>
      </div>

      <div className="medium-6 columns">
        <p className="medium-text-left">{service}</p>
      </div>
    </div>
  </footer>

}

export default CSSModules(Footer, styles)
