import React, {Component} from 'react'
import {inject /*,observer*/} from 'mobx-react'
import {translate} from 'react-polyglot'
//import SearchInput from 'common/components/SearchInput'
import CSSModules from 'react-css-modules'
import styles from './thankYou.scss'

@translate()
@inject('routingStore')
@CSSModules(styles)
//@observer
export default class ThankYou extends Component {

  goToHome = () => {
    const { routingStore: { push } } = this.props
    push('/')   //redirect to home
  }

  render() {
    const {t} = this.props
    return (
      <div>
        {/*<div className="row">
          <div className="column large-9 large-centered" style={{marginTop: '3rem'}}>
            <SearchInput />
          </div>
        </div>*/}
        <div className="row">
          <div className="column large-12" style={{marginTop: '5rem'}}>
            <div styleName="wrapper">
              <div styleName="sent">
                <b>{t('contact.success')}</b><br />
                <p>{t('contact.willCall')}</p>
                <button className="left" styleName="button-submit" onClick={this.goToHome}>{t('contact.toHome')}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
