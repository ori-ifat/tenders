import React from 'react'
import { func } from 'prop-types'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './NotLogged.scss'

@translate()
@CSSModules(styles)
export default class NotLogged extends React.Component {

  static propTypes = {
    onCancel: func
  }

  /*
  componentWillMount() {

  }
*/

  render() {
    const {onCancel, t} = this.props

    return (
      <div className="reveal-overlay" style={{display: 'block', zIndex: 1100}}>
        <div className="reveal" styleName="notlogged_lb" style={{display: 'block'}}>
          <button styleName="button-cancel" onClick={onCancel}>×</button>
          <div className="grid-x grid-margin-x" styleName="pb">
            <div className="small-12 cell">
              <h3 styleName="notlogged_ttl">{t('login.notLogged')}</h3>
              <div>{t('login.please')} <a>{t('login.login')}</a> {t('login.or')} <a>{t('login.register')}</a></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
