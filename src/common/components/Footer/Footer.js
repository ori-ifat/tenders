import React, {Component, PropTypes} from 'react'
import {translate} from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './Footer.scss'

@translate()
@CSSModules(styles)
export default class Footer extends React.Component {

  render() {
    const {t} = this.props
    return  <footer styleName="footer">
      <div className="row">
        <div className="medium-3 small-12  columns">
          <p styleName="link_ttl">ראשי</p>
          <ul className="no-bullet">
            <li><a href="">אודות</a></li>
            <li><a href="">מסלולים</a></li>
            <li><a href="">מוצרים ושירותים</a></li>
            <li><a href="">כניסה למנויים</a></li>
            <li><a href="">צור קשר</a></li>
          </ul>
        </div>

        <div className="medium-3 small-12  columns">
          <p styleName="link_ttl">מכרזים לפי גופים</p>
          <ul className="no-bullet">
            <li><a href="">מכרזי ממשלה</a></li>
            <li><a href="">מכרזי משרד הביטחון</a></li>
            <li><a href="">מכרזי מנהל מקרקעי ישראל</a></li>
            <li><a href="">מכרזי משרד החינוך</a></li>
            <li><a href="">מכרזי משטרה</a></li>
          </ul>
        </div>

        <div className="medium-3 small-12  columns">
          <p styleName="link_ttl">&nbsp;</p>
          <ul className="no-bullet">
            <li><a href="">מכרזי חברת החשמל</a></li>
            <li><a href="">מכרזי שירות המדינה</a></li>
            <li><a href="">מכרזי משרד הבריאות</a></li>
            <li><a href="">מכרזי משרד הרווחה</a></li>
            <li><a href="">מכרזי משרד השיכון והבינוי</a></li>
          </ul>
        </div>

        <div className="medium-3 small-12  columns">
          <p styleName="link_ttl">מכרזים לפי קטגוריות</p>
          <ul className="no-bullet">
            <li><a href="">מכרזי בניה</a></li>
            <li><a href="">מכרזי מקרקעין</a></li>
            <li><a href="">מכרזי נכסים</a></li>
            <li><a href="">מכרזי עבודות חשמל</a></li>
            <li><a href="">מכרזי הסעות</a></li>
            <li><a href="">מכרזי רכב</a></li>
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="medium-12 columns">
          <hr/>
        </div>
      </div>
      <div className="row">
        <div className="medium-6 small-12 columns">
          <p>{t('footer.rights')}</p>
        </div>

        <div className="medium-6 small-12 columns">
          <p className="medium-text-left">{t('footer.service')}</p>
        </div>
      </div>
    </footer>
  }
}
