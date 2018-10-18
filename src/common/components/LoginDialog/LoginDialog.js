import React from 'react'
import { string, func } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import {clearCache} from 'common/services/apiService'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import {fixTopMenu} from 'common/utils/topMenu'
import CSSModules from 'react-css-modules'
import styles from './LoginDialog.scss'

@translate()
@inject('accountStore')
@inject('routingStore')
@CSSModules(styles)
@observer
export default class LoginDialog extends React.Component {

  static propTypes = {
    onCancel: func,
    fromItem: string
  }

  @observable userName = ''
  @observable password = ''
  @observable rememberMe = false

  componentWillMount() {
    ReactModal.setAppElement('#root')
  }

  componentWillReceiveProps(nextProps) {

  }

  updateField = e => {
    //console.log('updateField', e.target.name, e.target.value)
    switch (e.target.name) {
    case 'userName':
      this.userName = e.target.value
      break
    case 'password':
      this.password = e.target.value
      break
    case 'rememberMe':
      this.rememberMe = e.target.checked
      break
    }
  }

  onKeyDown = e => {
    if (e.keyCode === 13) {
      e.stopPropagation()
      this.login()
    }
  }

  login = () => {
    const {accountStore, onCancel} = this.props
    const { routingStore: { push }, fromItem } = this.props
    if (!accountStore.profile) {
      accountStore.login(this.userName, this.password, this.rememberMe).then(() => {
        if (accountStore.error == null && accountStore.profile != null) {
          //successful login made
          clearCache()
          fixTopMenu()
          //push('/main')
          if (fromItem) {
            push(`/tender/${fromItem}`)
          }
          else {
            push('/main')
          }
          onCancel()  //close modal
        }
      }).catch(error => {
        console.error('[Login] Error:', error)
        //notifyMessage(error)
      })
    }
  }

  render() {
    const {accountStore, onCancel, t} = this.props
    return (
      <ReactModal
        isOpen={true}
        onRequestClose={onCancel}
        className="reveal-custom reveal-custom-login"
        overlayClassName="reveal-overlay-custom">
        <div styleName="login_lb">
          <button styleName="button-cancel" onClick={onCancel}>×</button>
          <div styleName="pb">
            <div styleName="login_container">
              <h3 styleName="login_ttl">{t('login.subscribeTitle')}</h3>
              <p styleName="subttl">{t('login.subscribeSubTitle')}</p>
              {accountStore.error != null && accountStore.profile == null &&
                <div styleName="error_box">{accountStore.errorMessage}</div>
              }
              <div styleName="input-placeholder">
                <input
                  type="text"
                  name="userName"
                  placeholder={t('login.usernameLabel')}
                  value={this.userName}
                  onChange={this.updateField}
                  onKeyDown={this.onKeyDown}
                />
              </div>
              <div styleName="input-placeholder">
                <input
                  type="password"
                  name="password"
                  placeholder={t('login.passwordLabel')}
                  value={this.password}
                  onChange={this.updateField}
                  onKeyDown={this.onKeyDown}
                />
              </div>
              <input type="checkbox" name="rememberMe" onChange={this.updateField}/>
              {t('login.rememberMe')}
              <div>
                <button styleName="button-submit" onClick={this.login}>{t('login.login')}</button>
              </div>
            </div>
            <div styleName="sign_up">
              <Link to='/contact' target='_blank'>
                <h3>{t('login.buy')}</h3>
                <p>{t('login.subscribe')}</p>
                <ul className="no-bullet">
                  <li>{t('login.benefit1')}</li>
                  <li>{t('login.benefit2')}</li>
                </ul>
                <button styleName="button-submit">{t('login.register')}</button>
              </Link>
            </div>
          </div>
        </div>
      </ReactModal>
    )
  }
}
