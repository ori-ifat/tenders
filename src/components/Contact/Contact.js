import React, {Component} from 'react'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import {translate} from 'react-polyglot'
import {checkEmail, checkPhone} from 'common/utils/validation'
import {contactUs} from 'common/services/apiService'
import Footer from 'common/components/Footer'
import CSSModules from 'react-css-modules'
import styles from './contact.scss'

const req = require.context('common/style/icons/', false)
const support = req('./support.png')
const tech_support = req('./tech_support.png')
const sales = req('./sales.png')

@translate()
@inject('routingStore')
@observer
@CSSModules(styles)
export default class Contact extends Component {

  @observable sent = false
  @observable status = ''
  @observable firstName = ''
  @observable email = ''
  @observable phone = ''

  componentWillMount() {

  }

  onChange = e => {
    switch (e.target.name) {
    case 'firstName':
      this.firstName = e.target.value
      break
    case 'email':
      this.email = e.target.value
      break
    case 'phone':
      this.phone = e.target.value
      break
    }
  }

  contactUs = () => {
    const {t} = this.props
    this.sent = false
    this.status = ''
    let errors = ''
    if (this.firstName == '') {
      errors += `${t('publish.enterName')}; `
    }

    if (this.email == '') {
      errors += `${t('publish.enterEmail')}; `
    }
    else if (!checkEmail(this.email, false)) {
      errors += `${t('publish.emailNotValid')}; `
    }

    if (this.phone == '') {
      errors += `${t('publish.enterPhone')}; `
    }
    else if (!checkPhone(this.phone, false)) {
      errors += `${t('publish.phoneNotValid')}; `
    }

    if (errors != '') {
      this.status = errors
    }
    else {
      //send data
      //console.log(this.toTime);
      const { routingStore: { push } } = this.props

      contactUs(this.firstName, this.email, this.phone).then(res => {
        //show a message
        //this.sent = true
        //this.status = t('publish.sentSuccessfully')
        //console.log(res, this.sent, this.status)
        push('/')   //redirect to home
      })
    }
  }

  render() {
    const {t} = this.props
    const style = this.sent ? 'sent' : 'errors'
    return (
      <div>
        <div className="row" styleName="title-container">
          <div className="column large-12">
            <h1 styleName="title">{t('contact.title')}</h1>
          </div>
        </div>

        <div className="row">
          <div className="column large-8">
            <div styleName="wrapper">
              {this.status != '' &&
              <div className="callout alert" styleName={style}>
                <p styleName={style} dangerouslySetInnerHTML={{__html: this.status}}></p>
              </div>
              }

              <div className="grid-x">
                <div styleName="pl" className="medium-6 cell">
                  <span>{t('contact.firstName')}:</span>
                  <input type="text" name="firstName" styleName="input-value" onChange={this.onChange} />
                </div>
              </div>

              <div className="grid-x">
                <div styleName="pl" className="medium-6 cell">
                  <span>{t('contact.email')}:</span>
                  <input type="email" name="email" styleName="input-value" onChange={this.onChange} />
                </div>
                <div styleName="pr" className="medium-6 cell">
                  <span>{t('contact.phone')}:</span>
                  <input type="tel" name="phone" styleName="input-value" onChange={this.onChange} />
                </div>
              </div>

              <div styleName="btn_container">
                <button className="left" styleName="button-submit" onClick={this.contactUs}>{t('contact.submit')}</button>
              </div>

            </div>
          </div>
          <div className="medium-4 columns">
            <div styleName="contact_info">

              <div className="media-object">
                <div className="media-object-section">
                  <img src={support} />
                </div>
                <div className="media-object-section main-section middle">
                  <p >{t('contact.service')}:<br/>03-5635070/3</p>
                </div>
              </div>

              <div className="media-object">
                <div className="media-object-section">
                  <img src={tech_support} />
                </div>
                <div className="media-object-section main-section middle">
                  <p >{t('contact.techsupport')}:<br/>03-5635031/7</p>
                </div>
              </div>

              <div className="media-object">
                <div className="media-object-section">
                  <img src={sales} />
                </div>
                <div className="media-object-section main-section middle">
                  <p >{t('contact.sales')}:<br/>03-5635000</p>
                </div>
              </div>

            </div>
          </div>
        </div>
        <Footer
          rights={t('home.rights')}
          service={t('home.service')}
        />
      </div>
    )
  }
}
