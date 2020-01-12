import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './LoginDialog.scss'

const LoginForm = ({accountStore, userName, password, updateField, onKeyDown, login, toggleRestore, t}) => {
  return <div>
    <p styleName="subttl">{t('login.subscribeSubTitle')}</p>
    {accountStore.error != null && accountStore.profile == null &&
      <div styleName="error_box">{accountStore.errorMessage}</div>
    }
    <div styleName="input-placeholder">
      <input
        type="text"
        name="userName"
        placeholder={t('login.usernameLabel')}
        value={userName}
        onChange={updateField}
        onKeyDown={e => onKeyDown(e, 'login')}
      />
    </div>
    <div styleName="input-placeholder">
      <input
        type="password"
        name="password"
        placeholder={t('login.passwordLabel')}
        value={password}
        onChange={updateField}
        onKeyDown={e => onKeyDown(e, 'login')}
      />
    </div>
    <input type="checkbox" name="rememberMe" onChange={updateField}/>
    {t('login.rememberMe')}
    <a onClick={toggleRestore} style={{paddingRight: '20px'}}>{t('login.forgotPassword')}</a>
    <div>
      <button styleName="button-submit" onClick={login}>{t('login.login')}</button>
    </div>
  </div>
}
export default CSSModules(LoginForm, styles, {allowMultiple: true})
