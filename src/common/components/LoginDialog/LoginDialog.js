import React from 'react'
import { bool, object, func } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import {clearCache} from 'common/services/apiService'
import FoundationHelper from 'lib/FoundationHelper'
import CSSModules from 'react-css-modules'
import styles from './LoginDialog.scss'

@translate()
@inject('accountStore')
@inject('routingStore')
@CSSModules(styles)
@observer
export default class LoginDialog extends React.Component {

  static propTypes = {
    onCancel: func
  }

  @observable userName = ''
  @observable password = ''
  @observable rememberMe = true

  componentWillMount() {

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

  login = () => {
    const {accountStore, onCancel} = this.props
    const { routingStore: { push } } = this.props
    if (!accountStore.profile) {
      accountStore.login(this.userName, this.password, this.rememberMe).then(() => {
        if (accountStore.error == null && accountStore.profile != null) {
          //successful login made
          clearCache()
          push('/')
          onCancel()  //close modal
          setTimeout(() => {
            //allow element to be created.
            FoundationHelper.reInitElement('top_nav')
          }, 200)
        }
      }).catch(error => {
        console.error('apiFetch Error:', error)
        //notifyMessage(error)
      })
    }
  }

  render() {
    const {accountStore, onCancel, t} = this.props
    return (
      <div className="reveal-overlay" style={{display: 'block', zIndex: 1200}}>
        <div className="reveal" styleName="login_lb" style={{display: 'block'}}>
          <button styleName="button-cancel" onClick={onCancel}>×</button>
          <div styleName="pb">
            <div styleName="login_container">
              <h3 styleName="login_ttl">{t('login.subscibeTitle')}</h3>
              <p styleName="subttl">{t('login.subscibeSubTitle')}</p>
              {accountStore.error != null && accountStore.profile == null &&
                <div styleName="error_box">{accountStore.errorMessage}</div>
              }

              <div styleName="input-placeholder"><input type="text" name="userName" placeholder={t('login.usernameLabel')} value={this.userName} onChange={this.updateField}/></div>



              <div styleName="input-placeholder"><input type="password" name="password" placeholder={t('login.passwordLabel')} value={this.password} onChange={this.updateField}/></div>
              <input type="checkbox" name="rememberMe" onChange={this.updateField}/>
              {t('login.rememberMe')}

              <div>
                <button styleName="button-submit" onClick={this.login}>{t('login.login')}</button>
              </div>

            </div>

            <div styleName="sign_up">
              <a href="#/subscriptions" target="_blank">
                <h3> רכישת מנוי</h3>
                <p>{t('login.subscribe')}</p>
                <ul className="no-bullet">
                  <li>הטבות בלעדיות לנרשמים דרך האתר</li>
                  <li>מגוון מסלולים רחב המתואם לכל עסק</li>
                </ul>
                <button styleName="button-submit" >להרשמה</button>

              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
