import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './Topbar.scss'
import {translate} from 'react-polyglot'
import {inject, observer} from 'mobx-react'
import {observable} from 'mobx'
import {clearCache, getRemindersCount, resetReminders} from 'common/services/apiService'
import LoginDialog from 'common/components/LoginDialog'
import FoundationHelper from 'lib/FoundationHelper'
import NotificationBadge from 'react-notification-badge'
import {Effect} from 'react-notification-badge'

const req = require.context('common/style/icons/', false)
const logoSrc = req('./logo.png')
const navIconSrc = req('./nav_icon.svg')
const userSrc = req('./user.svg')

const navbar = [  {
  title: 'subscriptions',
  link: '/subscriptions'
}, {
  title: 'services',
  link: '/services'
}, {
  title: 'contactus',
  link: '/contact'
}, {
  title: 'publish',
  link: '/publish'
}]

@translate()
@inject('routingStore')
@inject('accountStore')
@CSSModules(styles)
@observer //note if class is not an observer, it will not be affected from changes in other classes observables...
export default class Topbar extends Component {

  @observable showLoginDialog = false
  @observable messageCount = 0
  componentWillMount() {
    //fix top nav foundation creation bug
    setTimeout(() => {
      //allow element to be created.
      FoundationHelper.initElement('top_nav')
    }, 500)

    setTimeout(() => {
      //allow element to be created.
      FoundationHelper.reInitElement('top_nav')
    }, 1000)
  }

  componentWillReceiveProps(nextProps) {
    //console.log('receive', nextProps)
    if (nextProps.notify) {
      getRemindersCount().then(res =>
        this.messageCount = res
      )
    }
    else {
      clearCache()
      resetReminders().then(() =>
        this.messageCount = 0
      )
    }
  }

  navigate = route => () => {
    const { routingStore: { push, location: { pathname: path } } } = this.props
    if (path !== route) {
      push(route)
    }
  }

  goToHome = () => {
    const {accountStore, routingStore: {push}} = this.props
    const homeLink = accountStore.profile ? '/main' : '/home'
    push(homeLink)
  }

  login = () => {
    this.showLoginDialog = true
  }

  logout = () => {
    const {accountStore, routingStore: {push}} = this.props
    accountStore.logout()
    clearCache()
    push('/')
  }

  continueUnlogged = () => {
    this.showLoginDialog = false
  }

  render() {
    const {accountStore, t} = this.props
    const loginLabel = accountStore.profile ? decodeURIComponent(accountStore.profile.contactName).replace(/\+/g, ' ') : t('nav.pleaseLog')
    //const homeLink = accountStore.profile ? '/main' : '/home'
    //console.log(accountStore.profile, homeLink)
    return (
      <div styleName="header">
        <nav className="column row">
          <div className="top-bar" styleName="top-bar">
            <div className="top-bar-right">
              <a onClick={this.goToHome}>
                <img src={logoSrc} alt={t('nav.logoAlt')} title={t('nav.logoAlt')} id="logo" />
              </a>
            </div>

            <div className="top-bar-left" styleName="top-bar-left" style={{position: 'relative'}}>
              <div styleName="nav_icon_container" data-responsive-toggle="top_nav" data-hide-for="medium">
                <button type="button" data-toggle="top_nav"><img src={navIconSrc} alt="" /></button>
              </div>
              <ul className="dropdown vertical medium-horizontal menu" styleName="menu" id="top_nav" data-dropdown-menu>
                {
                  navbar.map((nav, index) => {
                    const style = nav.title == 'publish' ? 'publish-link' : ''
                    return <li key={index}><a styleName={style} onClick={this.navigate(`${nav.link}`)}>{t(`nav.${nav.title}`)}</a></li>
                  })
                }
                <li>
                  {this.messageCount > 0 &&
                  <div style={{position: 'absolute', left: '0', top: '0'}}>
                    <NotificationBadge count={this.messageCount} effect={Effect.SCALE}/>
                  </div>
                  }
                  {accountStore.profile ?
                    <a onClick={f => f}><img src={userSrc} alt="" />{loginLabel}</a>
                    :
                    <a onClick={this.login}><img src={userSrc} alt="" />{loginLabel}</a>
                  }
                  {accountStore.profile &&
                  <ul id="logout" className="submenu menu vertical" styleName="menu" data-dropdown-menu>
                    <li><a onClick={this.navigate('/smartagent')}>{t('nav.smartagent')}</a></li>
                    <li><a onClick={this.navigate('/favorites')}>{t('nav.favorites')}</a></li>
                    <li><a onClick={this.navigate('/reminders')}>{t('nav.reminders')}</a></li>
                    <li><a onClick={this.logout}>{t('nav.logout')}</a></li>
                  </ul>}
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {this.showLoginDialog &&
          <LoginDialog
            onCancel={this.continueUnlogged}
          />
        }
      </div>
    )
  }
}
