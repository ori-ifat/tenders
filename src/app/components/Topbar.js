import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './Topbar.scss'
import {translate} from 'react-polyglot'
import {inject, observer} from 'mobx-react'
import {clearCache} from 'common/services/apiService'
import FoundationHelper from 'lib/FoundationHelper'

const req = require.context('common/style/icons/', false)
const logoSrc = req('./logo.png')
const navIconSrc = req('./nav_icon.svg')
const userSrc = req('./user.svg')

const navbar = [  {
  title: 'subscriptions',
  link: '/subscriptions'
}, {
  title: 'contactus',
  link: '/contact'
}, {
  title: 'publish',
  link: '/publish'
}]

@translate()
@inject('translationsStore')
@inject('routingStore')
@inject('accountStore')
@CSSModules(styles, { allowMultiple: true })
@observer //note if class is not an observer, it will not be affected from changes in other classes observables...
export default class Topbar extends Component {

  componentWillMount() {
    setTimeout(() => {
      //allow element to be created.
      FoundationHelper.initElement('logout')
    }, 200)
  }

  componentWillReceiveProps(nextProps) {
    setTimeout(() => {
      //allow element to be created.
      FoundationHelper.initElement('logout')
    }, 200)
  }

  navigate = route => () => {
    const { routingStore: { push, location: { pathname: path } } } = this.props
    if (path !== route) {
      push(route)
    }
  }

  login = () => {
    //temp implementation - login assistant
    const {accountStore} = this.props
    if (!accountStore.profile) {
      accountStore.login('r314g', 'r314g', true)
      clearCache()
      this.navigate('/')
    }
  }

  logout = () => {
    const {accountStore} = this.props
    accountStore.logout()
    clearCache()
    this.navigate('/')
  }

  render() {
    const {accountStore, t} = this.props

    return (
      <div styleName="header">
        <nav styleName="column row">
          <div styleName="top-bar">
            <div styleName="top-bar-right">
              <a onClick={this.navigate('/')}>
                <img src={logoSrc} alt={t('nav.logoAlt')} id="logo" />
              </a>
            </div>

            <div styleName="top-bar-left" style={{position: 'relative'}}>
              <div styleName="nav_icon_container" data-responsive-toggle="top_nav" data-hide-for="medium">
                <button type="button" data-toggle="top_nav"><img src={navIconSrc} alt="" /></button>
              </div>
              <ul styleName="dropdown vertical medium-horizontal menu" id="top_nav" data-dropdown-menu>
                {navbar.map((nav, index) =>
                  <li key={index}><a onClick={this.navigate(`${nav.link}`)}>{t(`nav.${nav.title}`)}</a></li>
                ) }
                <li styleName="">
                  <a onClick={this.login}><img src={userSrc} alt="" />{accountStore.profile ? accountStore.profile.userName : t('nav.pleaseLog')}</a>
                  {accountStore.profile &&
                  <ul id="logout" styleName="submenu menu vertical" data-dropdown-menu>
                    <li><a onClick={this.logout}>{t('nav.logout')}</a></li>
                  </ul>}
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}
