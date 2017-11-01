import React, {Component} from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { translate } from 'react-polyglot'
import moment from 'moment'
import {addReminder} from 'common/services/apiService'
//import DatePicker from 'react-datepicker'
import CSSModules from 'react-css-modules'
import styles from './Reminder.scss'
//import 'react-datepicker/dist/react-datepicker-cssmodules.css'
//import 'common/style/_datepicker.scss'

@translate()
@observer
@CSSModules(styles, { allowMultiple: true })
export default class Reminder extends Component {

  @observable tenderID = -1
  @observable subject;
  @observable time;
  @observable infoDate;
  @observable remark;

  componentWillMount() {
    const {tenderID, title, infoDate} = this.props
    this.tenderID = tenderID
    this.subject = title
    this.infoDate = moment(infoDate).format('DD-MM-YYYY')
    this.time = '00:00'
    this.remark = ''
  }

  updateField = e => {
    switch (e.target.name) {
    case 'subject':
      this.subject = e.target.value
      break
    case 'time':
      this.time = e.target.value
      break
    case 'date':
      this.infoDate = e.target.value
      break
    case 'remark':
      this.remark = e.target.value
      break
    }
  }

  getDatetime = field => {
    return moment()
  }

  dateModified = key => value => {
    console.log(key, value)
  }

  addReminder = () => {
    //console.log('addReminder', this.subject, this.time, this.infoDate, this.remark)
    //temp until DatePicker implementation... note, take from DD-MM-YYYY HH:mm format
    const _date = moment(`${this.infoDate} ${this.time}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss')
    //console.log(_date)
    addReminder(this.tenderID, this.remark, this.subject, _date).then(saved => {
      console.log('saved status:', saved) //implement if user should know something about save op
      this.props.onCancel() //...close the modal
    })
  }

  render() {
    const {title, infoDate, onCancel, t} = this.props
    const dateVal = moment(infoDate).format('DD-MM-YYYY')
    const timeVal = moment(infoDate).format('HH:mm')

    return (
      <div className="reveal-overlay" style={{display: 'block'}}>
        <div className="reveal tiny" style={{display: 'block'}}>
          <h2>{t('reminder.title')}</h2>
          <div>
            <span>{t('reminder.subject')}</span>
            <input type="text" name="subject" defaultValue={title} onBlur={this.updateField}/>
          </div>
          <div styleName="clearfix">
            <div styleName="time">
              <span>{t('reminder.time')}</span>
              <input type="text" name="time" defaultValue={timeVal} onBlur={this.updateField} />
            </div>
            <div styleName="date">
              <span>{t('reminder.date')}</span>
              <input type="text" name="date" defaultValue={dateVal} onBlur={this.updateField} />
              {/*<div styleName="ui-filter-date">
                <DatePicker
                  bsSize="lg"
                  locale="he-IL"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  selected={this.getDatetime('dateStart')}
                  onChange={this.dateModified('dateStart')}
                  todayButton={t('reminder.today')}
                />
              </div>*/}
            </div>
            <span>{t('reminder.delivery', {dateVal})}</span>
          </div>
          <div>
            <span>{t('reminder.remark')}</span>
            <textarea name="remark" onBlur={this.updateField} />
          </div>
          <div styleName="button-container">
            <button styleName="button-cancel" onClick={onCancel}>{t('reminder.cancel')}</button>
            <button styleName="button-submit" onClick={this.addReminder}>{t('reminder.submit')}</button>
          </div>
        </div>
      </div>
    )
  }
}
