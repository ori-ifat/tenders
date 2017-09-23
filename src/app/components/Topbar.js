import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './Topbar.scss'
import {translate} from 'react-polyglot'
import {inject} from 'mobx-react'

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
@CSSModules(styles, { allowMultiple: true })
export default class Topbar extends Component {

  navigate = route => () => {
    const { routingStore: { push, location: { pathname: path } } } = this.props
    if (path !== route) {
      push(route)
    }
  }

  render() {
    const {t} = this.props

    return (
      <div styleName="header">
        <nav styleName="column row">
          <div styleName="top-bar">
            <div styleName="top-bar-right">
              <img src={logoSrc} alt={t('nav.logoAlt')} id="logo" />
            </div>

            <div styleName="top-bar-left" style={{position: 'relative'}}>
              <div styleName="nav_icon_container" data-responsive-toggle="top_nav" data-hide-for="medium">
                <button type="button" data-toggle="top_nav"><img src={navIconSrc} alt="" /></button>
              </div>
              <ul styleName="vertical dropdown menu medium-horizontal" id="top_nav" data-dropdown-menu data-disable-hover="true" data-click-open="true" >
                {navbar.map((nav, index) =>
                  <li key={index}><a onClick={this.navigate(`${nav.link}`)}>{t(`nav.${nav.title}`)}</a></li>
                ) }
                <li>
                  <a href="#"><img src={userSrc} alt="" />{t('nav.fakeUser')}</a>
                  <ul styleName="menu" data-dropdown-menu>
                    <li><a onClick={this.navigate('logout')}>{t('nav.logout')}</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}
