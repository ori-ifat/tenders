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
@CSSModules(styles, {allowMultiple: true})
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

  navigate = route => () => {
    const { routingStore: { push, location: { pathname: path } } } = this.props
    if (path !== route) {
      push(route)
    }
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
    if (!accountStore.profile) {
      accountStore.login(this.userName, this.password, this.rememberMe).then(() => {
        if (accountStore.error == null && accountStore.profile != null) {
          //successful login made
          clearCache()
          this.navigate('/')
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
          <div className="grid-x grid-margin-x" styleName="pb">
            <div className="small-12 cell">
              <h3 styleName="login_ttl">{t('login.title')}</h3>
              <div styleName="clearfix">
                <div styleName="input-label">{t('login.usernameLabel')}</div>
                <div styleName="input-placeholder"><input type="text" name="userName" value={this.userName} onChange={this.updateField}/></div>
              </div>
              <div styleName="clearfix">
                <div styleName="input-label">{t('login.passwordLabel')}</div>
                <div styleName="input-placeholder"><input type="password" name="password" value={this.password} onChange={this.updateField}/></div>
              </div>
              <div styleName="clearfix">
                <div styleName="input-label" style={{width: '10%'}}>
                  <input type="checkbox" name="rememberMe" onChange={this.updateField}/>
                </div>
                <div styleName="input-placeholder" style={{width: '90%'}}>
                  {t('login.rememberMe')}
                </div>
              </div>
              {accountStore.error != null && accountStore.profile == null &&
                <div style={{color: 'red'}}>{accountStore.errorMessage}</div>
              }
            </div>
            <div className="grid-x grid-margin-x" styleName="buttons_cont">
              <div className="small-12 cell">
                <button styleName="button-submit" onClick={this.login}>{t('login.login')}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
