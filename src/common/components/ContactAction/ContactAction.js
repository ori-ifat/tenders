import React from 'react'
//import { string, func } from 'prop-types'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import { translate } from 'react-polyglot'
import {checkEmail, checkPhone} from 'common/utils/validation'
import {contactUs} from 'common/services/apiService'
import ReactModal from 'react-modal'
import CSSModules from 'react-css-modules'
import styles from './ContactAction.scss'

const req = require.context('common/style/icons/', false)
const contact = req('./mail_w.svg')

@translate()
@inject('routingStore')
@observer
@CSSModules(styles)
export default class ContactAction extends React.Component {

  @observable modalOpen = false
  @observable sent = false
  @observable status = ''
  @observable firstName = ''
  @observable email = ''
  @observable phone = ''
  @observable comment = ''

  static propTypes = {

  }

  componentWillMount() {
    ReactModal.setAppElement('#root')
    this.status = ''
  }

  componentWillReceiveProps(nextProps) {
    this.status = ''
  }

  onOpen = () => {
    //this.setState({open: true})
    this.modalOpen = true
  }

  onClose = () => {
    //this.setState({open: false})
    this.modalOpen = false
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
    case 'comment':
      this.comment = e.target.value
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
      contactUs(this.firstName, this.email, this.phone, this.comment).then(res => {
        //show a message
        this.sent = true
        this.status = t('contact.success')
        //console.log(res, this.sent, this.status)
        //push('/')   //redirect to home
        push('/thankyou') //means that local message wil not be displayed...
      })
    }
  }

  render() {
    const { t } = this.props
    const style = this.sent ? 'sent' : 'errors'
    return (
      <div>
        <ReactModal
          isOpen={this.modalOpen}
          onRequestClose={this.onClose}
          className="reveal-custom"
          overlayClassName="reveal-overlay-custom">
          <div styleName="container">
            <div className="row">
              <div className="column large-12">

                <h3 styleName="message">{t('contact.title')}</h3>

                {!this.sent && this.status != '' &&
                <div className="callout alert" styleName={style}>
                  <p styleName={style} dangerouslySetInnerHTML={{__html: this.status}}></p>
                </div>
                }
                <div styleName="pl" className="medium-12 medium-centered cell">
                  <span>{t('contact.firstName')}:</span>
                  <input type="text" name="firstName" styleName="input-value" onChange={this.onChange} />
                </div>
                <div styleName="pl" >
                  <span>{t('contact.email')}:</span>
                  <input type="email" name="email" styleName="input-value" onChange={this.onChange} />
                </div>
                <div styleName="pl" >
                  <span>{t('contact.phone')}:</span>
                  <input type="tel" name="phone" styleName="input-value" onChange={this.onChange} />
                </div>
                <div styleName="pl" >
                  <span>{t('contact.why')}:</span>
                  <textarea name="comment" styleName="input-value" onChange={this.onChange} />
                </div>
                <div styleName="btn_container">
                  <button className="left" styleName="button-submit" onClick={this.contactUs}>{t('contact.submit')}</button>
                </div>

              </div>
            </div>
          </div>
        </ReactModal>
        <a onClick={this.onOpen} styleName="button-call"><img src={contact}/></a>
      </div>
    )
  }
}
