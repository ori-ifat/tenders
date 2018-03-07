import React, {Component} from 'react'
import { withRouter } from 'react-router'
import { inject, observer } from 'mobx-react'
//import { observable } from 'mobx'
import {clearCache} from 'common/services/apiService'
import {fixTopMenu} from 'common/utils/topMenu'
import CSSModules from 'react-css-modules'
import styles from './login.scss'

@withRouter
@inject('accountStore')
@inject('routingStore')
@observer
@CSSModules(styles)
export default class Login extends Component {

  //@observable itemID = -1

  componentWillMount() {
    const { accountStore } = this.props
    if (accountStore.profile) {
      accountStore.logout().then(() => {
        this.login()
      })
    }
    else {
      this.login()
    }
  }

  login = () => {
    const { accountStore, match: {params: { user, pass }}, routingStore: { push } } = this.props
    accountStore.login(decodeURIComponent(user), decodeURIComponent(pass), false).then(() => {
      if (accountStore.error == null && accountStore.profile != null) {
        //successful login made
        clearCache()
        fixTopMenu()
        push('/main')
      }
    }).catch(error => {
      console.error('[Login] Error:', error)
      //notifyMessage(error)
    })
  }

  render() {
    const { accountStore } = this.props
    return (
      <div>
        {
          accountStore.error != null && <div styleName="error">{accountStore.error}</div>
        }
      </div>
    )
  }
}
