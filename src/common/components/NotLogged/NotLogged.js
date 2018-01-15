import React from 'react'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './NotLogged.scss'

@translate()
@CSSModules(styles)
export default class NotLogged extends React.Component {

  render() {
    const {t} = this.props
    return (
      <div className="row">
        <div className="large-12 columns">
          <h3>{t('login.subscibeTitle')}</h3>
        </div>
      </div>
    )
  }
}
