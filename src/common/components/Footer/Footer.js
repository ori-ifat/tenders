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
          <p styleName="link_ttl">{t('footer.linkTitle')}</p>
          <ul className="no-bullet">
            <li><a href="">{t('footer.about')}</a></li>
            <li><a href="">{t('footer.subscriptions')}</a></li>
            <li><a href="">{t('footer.services')}</a></li>
            <li><a href="">{t('footer.login')}</a></li>
            <li><a href="">{t('footer.contact')}</a></li>
          </ul>
        </div>

        <div className="medium-3 small-12  columns">
          <p styleName="link_ttl">{t('footer.bodies')}</p>
          <ul className="no-bullet">
            <li><a href="">{t('footer.gov')}</a></li>
            <li><a href="">{t('footer.defence')}</a></li>
            <li><a href="">{t('footer.minhal')}</a></li>
            <li><a href="">{t('footer.education')}</a></li>
            <li><a href="">{t('footer.police')}</a></li>
          </ul>
        </div>

        <div className="medium-3 small-12  columns">
          <p styleName="link_ttl">&nbsp;</p>
          <ul className="no-bullet">
            <li><a href="">{t('footer.electricity')}</a></li>
            <li><a href="">{t('footer.country')}</a></li>
            <li><a href="">{t('footer.health')}</a></li>
            <li><a href="">{t('footer.welfare')}</a></li>
            <li><a href="">{t('footer.binuy')}</a></li>
          </ul>
        </div>

        <div className="medium-3 small-12  columns">
          <p styleName="link_ttl">{t('footer.categories')}</p>
          <ul className="no-bullet">
            <li><a href="">{t('footer.building')}</a></li>
            <li><a href="">{t('footer.land')}</a></li>
            <li><a href="">{t('footer.assets')}</a></li>
            <li><a href="">{t('footer.electricity2')}</a></li>
            <li><a href="">{t('footer.drive')}</a></li>
            <li><a href="">{t('footer.drive2')}</a></li>
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
