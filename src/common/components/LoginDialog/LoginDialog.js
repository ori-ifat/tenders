import React from 'react'
import { string, func } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import {clearCache, requestRestorePassword} from 'common/services/apiService'
import ReactModal from 'react-modal'
import { Link } from 'react-router-dom'
import {fixTopMenu} from 'common/utils/topMenu'
import CSSModules from 'react-css-modules'
import LoginForm from './LoginForm'
import ForgotPassword from './ForgotPassword'
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
  @observable email = ''
  @observable restore = false
  @observable sentMessage = ''
  @observable sentError = false

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
    case 'email':
      this.email = e.target.value
      break
    }
  }

  onKeyDown = (e, which) => {
    if (e.keyCode === 13) {
      e.stopPropagation()
      which == 'login' ? this.login() : this.restorePassword()
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

  restorePassword = () => {
    //console.log('restore')
    const {onCancel, t} = this.props
    requestRestorePassword(this.userName, this.email).then(res => {
      console.log(res)
      if (res.sent) {
        this.sentMessage = t('login.sent', {email: this.email})
        this.sentError = false
      }
      else {
        this.sentMessage = t('login.noSuchUser')
        this.sentError = true
      }
    })
  }

  toggleRestore = () => {
    this.restore = !this.restore
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
              {!this.restore ? <LoginForm
                accountStore={accountStore}
                userName={this.userName}
                password={this.password}
                updateField={this.updateField}
                onKeyDown={this.onKeyDown}
                login={this.login}
                toggleRestore={this.toggleRestore}
                t={t} /> :
                <ForgotPassword
                  accountStore={accountStore}
                  userName={this.userName}
                  email={this.email}
                  updateField={this.updateField}
                  onKeyDown={this.onKeyDown}
                  restore={this.restorePassword}
                  toggleRestore={this.toggleRestore}
                  sentMessage={this.sentMessage}
                  sentError={this.sentError}
                  t={t} />}
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
