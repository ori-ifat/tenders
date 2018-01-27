import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from './Footer.scss'

const Footer = ({rights, service}) => {
  return  <footer styleName="footer">
    <div className="row">
      <div className="medium-3 columns">
        <p styleName="link_ttl">כותרת של הלינקים</p>
        <ul className="no-bullet">
          <li><a href="">קישור כלשהו כאן</a></li>
          <li><a href="">מכרזי תחבורה</a></li>
          <li><a href="">למכרזים משלתים</a></li>
          <li><a href="">מכרזי כלכלה</a></li>
        </ul>
      </div>

      <div className="medium-3 columns">
        <p styleName="link_ttl">כותרת של הלינקים</p>
        <ul className="no-bullet">
          <li><a href="">קישור כלשהו כאן</a></li>
          <li><a href="">למכרזיממשלתים</a></li>
          <li><a href="">מכרז ממשלתי</a></li>
          <li><a href="">עוד קישור כאן</a></li>
        </ul>
      </div>

      <div className="medium-3 columns">
        <p styleName="link_ttl">כותרת של הלינקים</p>
        <ul className="no-bullet">
          <li><a href="">קישור כלשהו כאן</a></li>
          <li><a href="">מכרזי תחבורה</a></li>
          <li><a href="">מכרזי כלכלה</a></li>
          <li><a href="">קישור כלשהו כאן</a></li>
        </ul>
      </div>

      <div className="medium-3 columns">
        <p styleName="link_ttl">כותרת של הלינקים</p>
        <ul className="no-bullet">
          <li><a href="">קישור כלשהו כאן</a></li>
          <li><a href="">קישור כללי</a></li>
          <li><a href="">קישור כלשהו כאן</a></li>
          <li><a href="">מכרזי תחבורה</a></li>
        </ul>
      </div>

    </div>
    <div className="row">
      <div className="medium-12 columns">
        <hr/>
      </div>
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
