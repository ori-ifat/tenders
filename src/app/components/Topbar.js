import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './Topbar.scss'
import {translate} from 'react-polyglot'
import {inject} from 'mobx-react'

const navbar = [  {
  title: 'search',
  link: '/search'
}, {
  title: 'test',
  link: '/test'
}]

@translate()
@inject('translationsStore')
@inject('routingStore')
@CSSModules(styles)
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
      <div>
        <div styleName="header">{t('AppTitle')}</div>
        <div>
          <div>
            {navbar.map((nav, index) =>
              <div key={index} styleName="nav-link">
                <span style={{cursor: 'pointer', color: 'crimson'}} onClick={this.navigate(`${nav.link}`)}>
                  {t(`nav.${nav.title}`)}
                </span>
              </div>
            ) }
          </div>
        </div>
      </div>
    )
  }
}
