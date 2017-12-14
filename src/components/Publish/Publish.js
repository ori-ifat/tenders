import React, {Component} from 'react'
import { withRouter } from 'react-router'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import {translate} from 'react-polyglot'
import moment from 'moment'
import {publishTender} from 'common/services/apiService'
import Calendar from 'common/components/Calendar'
import CSSModules from 'react-css-modules'
import styles from './publish.scss'

@translate()
@withRouter
@observer
@CSSModules(styles)
export default class Publish extends Component {

  @observable sent = false
  @observable status = ''
  @observable firstName = ''
  @observable lastName = ''
  @observable companyName = ''
  @observable companyPhone = ''
  @observable endDate = moment()
  @observable toTime = '00:00'
  @observable email = ''
  @observable phone = ''
  @observable fax = ''
  @observable address = ''
  @observable title = ''
  @observable description = ''

  componentWillMount() {
    //const { match: {params: { itemId }} } = this.props
  }

  selectDate = (date, field) => {
    this.endDate = date
    //console.log(date, field);
  }

  onChange = e => {
    switch (e.target.name) {
    case 'firstName':
      this.firstName = e.target.value
      break
    case 'lastName':
      this.lastName = e.target.value
      break
    case 'companyName':
      this.companyName = e.target.value
      break
    case 'companyPhone':
      this.companyPhone = e.target.value
      break
    case 'toTime':
      this.toTime = e.target.value
      break
    case 'email':
      this.email = e.target.value
      break
    case 'phone':
      this.phone = e.target.value
      break
    case 'fax':
      this.fax = e.target.value
      break
    case 'address':
      this.address = e.target.value
      break
    case 'title':
      this.title = e.target.value
      break
    case 'description':
      this.description = e.target.value
      break
    }
  }

  publishTender = () => {
    const {t} = this.props    
    this.sent = false
    this.status = ''
    let errors = ''
    if (this.firstName == '') {
      errors += `${t('publish.enterName')}; `
    }
    if (this.lastName == '') {
      errors += `${t('publish.enterLastName')}; `
    }
    if (this.companyName == '') {
      errors += `${t('publish.enterCompanyName')}; `
    }
    if (this.email == '') {
      errors += `${t('publish.enterEmail')}; `
    }
    if (this.phone == '') {
      errors += `${t('publish.enterPhone')}; `
    }
    if (this.title == '') {
      errors += `${t('publish.enterTitle')}; `
    }
    if (this.description == '') {
      errors += `${t('publish.enterDesc')}; `
    }

    if (errors != '') {
      this.status = errors
    }
    else {
      //send data
      //console.log(this.toTime);
      const toDateVal = moment(this.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
      const toDate = moment(`${toDateVal} ${this.toTime}`, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss')
      publishTender(this.firstName, this.lastName, this.companyName, this.companyPhone,
        toDate, this.email, this.phone, this.fax, this.address, this.title, this.description).then(res => {
        //console.log(res)
        //show a message
        this.sent = true
        this.status = t('publish.sentSuccessfully')
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
            <h1 styleName="title">{t('publish.title')}</h1>
          </div>
        </div>
        <div className="row">
          <div className="column large-12">
            <h4 styleName={style} dangerouslySetInnerHTML={{__html: this.status}}></h4>
          </div>
        </div>
        <div className="row">
          <div className="column large-3">
            <span>{t('publish.firstName')}:</span>
          </div>
          <div className="column large-9">
            <input type="text" name="firstName" styleName="input-value" onChange={this.onChange} />
          </div>
        </div>
        <div className="row">
          <div className="column large-3">
            <span>{t('publish.lastName')}:</span>
          </div>
          <div className="column large-9">
            <input type="text" name="lastName" styleName="input-value" onChange={this.onChange} />
          </div>
        </div>
        <div className="row">
          <div className="column large-3">
            <span>{t('publish.companyName')}:</span>
          </div>
          <div className="column large-9">
            <input type="text" name="companyName" styleName="input-value" onChange={this.onChange} />
          </div>
        </div>
        <div className="row">
          <div className="column large-3">
            <span>{t('publish.companyPhone')}:</span>
          </div>
          <div className="column large-9">
            <input type="tel" name="companyPhone" styleName="input-value" onChange={this.onChange} />
          </div>
        </div>
        <div className="row">
          <div className="column large-3">
            <span>{t('publish.toDate')}:</span>
          </div>
          <div className="column large-2" style={{paddingBottom: '0.5rem', marginBottom: '0.4rem'}}>
            <Calendar
              name="endDate"
              defaultDate={this.endDate}
              todayLabel={t('filter.today')}
              selectDate={this.selectDate}
              showMonths={true}
              showYears={true}
            />
          </div>
        </div>
        <div className="row">
          <div className="column large-3">
            <span>{t('publish.toTime')}:</span>
          </div>
          <div className="column large-2">
            <input type="time" name="toTime" onChange={this.onChange} />
          </div>
        </div>
        <div className="row">
          <div className="column large-3">
            <span>{t('publish.email')}:</span>
          </div>
          <div className="column large-9">
            <input type="email" name="email" styleName="input-value" onChange={this.onChange} />
          </div>
        </div>
        <div className="row">
          <div className="column large-3">
            <span>{t('publish.phone')}:</span>
          </div>
          <div className="column large-9">
            <input type="tel" name="phone" styleName="input-value" onChange={this.onChange} />
          </div>
        </div>
        <div className="row">
          <div className="column large-3">
            <span>{t('publish.fax')}:</span>
          </div>
          <div className="column large-9">
            <input type="tel" name="fax" styleName="input-value" onChange={this.onChange} />
          </div>
        </div>
        <div className="row">
          <div className="column large-3">
            <span>{t('publish.address')}:</span>
          </div>
          <div className="column large-9">
            <input type="text" name="address" styleName="input-value" onChange={this.onChange} />
          </div>
        </div>
        <div className="row">
          <div className="column large-3">
            <span>{t('publish.tenderTitle')}:</span>
          </div>
          <div className="column large-9">
            <input type="text" name="title" styleName="input-value" onChange={this.onChange} />
          </div>
        </div>
        <div className="row">
          <div className="column large-3">
            <span>{t('publish.tenderDesc')}:</span>
          </div>
          <div className="column large-9">
            <textarea name="description" styleName="input-value" style={{height: '300px'}} onChange={this.onChange} />
          </div>
        </div>
        <div className="row" style={{paddingBottom: '0.5rem', marginBottom: '1rem'}}>
          <div className="column large-8">
            <button styleName="button-submit" onClick={this.publishTender}>{t('publish.submit')}</button>
          </div>
          <div className="column large-4">
            &nbsp;
          </div>
        </div>
      </div>
    )
  }
}
