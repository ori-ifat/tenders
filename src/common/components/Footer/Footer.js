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
        <div className="medium-3 columns">
          <p styleName="link_ttl">{t('footer.linkTitle')}</p>
          <ul className="no-bullet">
            <li><a href="">{t('footer.link')}</a></li>
            <li><a href="">{t('footer.transport')}</a></li>
            <li><a href="">{t('footer.gov')}</a></li>
            <li><a href="">{t('footer.economy')}</a></li>
          </ul>
        </div>

        <div className="medium-3 columns">
          <p styleName="link_ttl">{t('footer.linkTitle')}</p>
          <ul className="no-bullet">
            <li><a href="">{t('footer.link')}</a></li>
            <li><a href="">{t('footer.transport')}</a></li>
            <li><a href="">{t('footer.gov')}</a></li>
            <li><a href="">{t('footer.economy')}</a></li>
          </ul>
        </div>

        <div className="medium-3 columns">
          <p styleName="link_ttl">{t('footer.linkTitle')}</p>
          <ul className="no-bullet">
            <li><a href="">{t('footer.link')}</a></li>
            <li><a href="">{t('footer.transport')}</a></li>
            <li><a href="">{t('footer.gov')}</a></li>
            <li><a href="">{t('footer.economy')}</a></li>
          </ul>
        </div>

        <div className="medium-3 columns">
          <p styleName="link_ttl">{t('footer.linkTitle')}</p>
          <ul className="no-bullet">
            <li><a href="">{t('footer.link')}</a></li>
            <li><a href="">{t('footer.transport')}</a></li>
            <li><a href="">{t('footer.gov')}</a></li>
            <li><a href="">{t('footer.economy')}</a></li>
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="medium-12 columns">
          <hr/>
        </div>
        <div className="medium-6 columns">
          <p>{t('footer.rights')}</p>
        </div>

        <div className="medium-6 columns">
          <p className="medium-text-left">{t('footer.service')}</p>
        </div>
      </div>
    </footer>
  }
}
