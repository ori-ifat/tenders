import React, {Component, PropTypes} from 'react'
import {inject, observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import LoginDialog from 'common/components/LoginDialog'
import {getFooterPublishers} from 'common/services/apiService'
import take from 'lodash/take'
import takeRight from 'lodash/takeRight'
import CSSModules from 'react-css-modules'
import styles from './Footer.scss'

const navbar = [{
  title: 'about',
  link: '/about'
}, {
  title: 'subscriptions',
  link: '/subscriptions'
}, {
  title: 'services',
  link: '/services'
}, {
  title: 'login',
  link: ''
}, {
  title: 'contact',
  link: '/contact'
}]

@translate()
@inject('routingStore')
@CSSModules(styles)
@observer
export default class Footer extends React.Component {

  @observable showLoginDialog = false
  @observable publishers = []

  componentWillMount() {
    getFooterPublishers().then(res =>
      this.publishers = res
    )
  }

  navigate = (title, route) => {
    if (title != 'login') {
      this.goTo(route)
    }
    else {
      this.showLoginDialog = true
    }
  }

  navigate2 = (id, shortName) => {
    const url = `Category/${id}/${shortName}`
    this.goTo(url)
  }

  goTo = (route) => {
    const { routingStore: { push } } = this.props
    push(route)
  }

  continueUnlogged = () => {
    this.showLoginDialog = false
  }

  render() {
    const {t} = this.props
    return  <footer styleName="footer">
      <div className="row">
        <div className="medium-3 small-12  columns">
          <p styleName="link_ttl">{t('footer.linkTitle')}</p>
          <ul className="no-bullet">
            {
              navbar.map((nav, index) => {
                return <li key={index}><a onClick={() => this.navigate(nav.title, nav.link)}>{t(`footer.${nav.title}`)}</a></li>
              })
            }
          </ul>
        </div>

        <div className="medium-3 small-12  columns">
          <p styleName="link_ttl">{t('footer.publishers')}</p>
          <ul className="no-bullet">
            {
              this.publishers && this.publishers.length > 0 && take(this.publishers, 5).map((publisher, index) =>
                <li key={index}><a onClick={() => this.navigate2(publisher.id, publisher.shortName)}>{publisher.name}</a></li>
              )
            }
          </ul>
        </div>

        <div className="medium-3 small-12  columns">
          <p styleName="link_ttl">&nbsp;</p>
          <ul className="no-bullet">
            {
              this.publishers && this.publishers.length > 0 && takeRight(this.publishers, 5).map((publisher, index) =>
                <li key={index}><a onClick={() => this.navigate2(publisher.id, publisher.shortName)}>{publisher.name}</a></li>
              )
            }
          </ul>
        </div>

        <div className="medium-3 small-12  columns">
          <p styleName="link_ttl">{t('footer.categories')}</p>
          <ul className="no-bullet">
            <li><a href="">{t('footer.building')}</a></li>
            <li><a href="">{t('footer.land')}</a></li>
            <li><a href="">{t('footer.assets')}</a></li>
            <li><a href="">{t('footer.electricity')}</a></li>
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
      {this.showLoginDialog &&
        <LoginDialog
          onCancel={this.continueUnlogged}
        />
      }
    </footer>
  }
}
