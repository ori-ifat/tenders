import React, {Component} from 'react'
//import CSSModules from 'react-css-modules'
//import styles from './Topbar.scss'
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
//@CSSModules(styles, { allowMultiple: true })
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
      <nav className="column row">
        <div className="top-bar">
          <div className="top-bar-right">
            <img src={logoSrc} alt={t('nav.logoAlt')} id="logo" />
          </div>

          <div className="top-bar-left" style={{position: 'relative'}}>
            <div className="nav_icon_container" data-responsive-toggle="top_nav" data-hide-for="medium">
              <button type="button" data-toggle="top_nav"><img src={navIconSrc} alt="" /></button>
            </div>
            <ul className="vertical dropdown medium-horizontal menu" id="top_nav" data-dropdown-menu>
              {navbar.map((nav, index) =>
                <li key={index}><a onClick={this.navigate(`${nav.link}`)}>{t(`nav.${nav.title}`)}</a></li>
              ) }
              <li>
                <a href="#"><img src={userSrc} alt="" />{t('nav.fakeUser')}</a>
                <ul className="menu">
                  <li><a onClick={this.navigate('logout')}>{t('nav.logout')}</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
