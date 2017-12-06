import React, {Component} from 'react'
import { string, number, func } from 'prop-types'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { translate } from 'react-polyglot'
import moment from 'moment'
import {setReminder, getReminder, clearCache} from 'common/services/apiService'
import {getCookie, setCookie} from 'common/utils/cookies'
import Calendar from 'common/components/Calendar'
import CSSModules from 'react-css-modules'
import styles from './Reminder.scss'

@translate()
@observer
@CSSModules(styles)
export default class Reminder extends Component {

  static propTypes = {
    tenderID: number,
    onClose: func,
    title: string,
    infoDate: string,
    reminderID: number
  }

  @observable tenderID = -1
  @observable subject = '';
  @observable time = '';
  @observable reminderDate;
  @observable remark = '';
  @observable email = '';
  @observable reminderID = 0

  componentWillMount() {
    const {tenderID, title, infoDate, reminderID} = this.props
    //console.log('mount', infoDate)
    this.tenderID = tenderID
    if (!reminderID) {
      this.subject = title
      this.reminderDate = infoDate != null ? moment(infoDate, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY') : moment()
      this.time = '00:00'
      this.remark = ''
    }
    else {
      this.reminderID = reminderID
      this.getReminderData(reminderID)
    }
    const email = getCookie('userEmail')
    this.email = email
  }

  componentWillReceiveProps(nextProps) {
    //console.log('receive')
  }

  getReminderData = (reminderID) => {
    //console.log('getReminderData')
    getReminder(reminderID).then(reminder => {
      this.subject = reminder[0].Title
      this.reminderDate = moment(reminder[0].ReminderDate).format('DD-MM-YYYY')
      this.time = moment(reminder[0].ReminderDate).format('HH:mm')
      this.remark = reminder[0].Remark || ''
    })
  }

  updateField = e => {
    //console.log('updateField', e.target.name, e.target.value)
    switch (e.target.name) {
    case 'subject':
      this.subject = e.target.value
      break
    case 'time':
      this.time = e.target.value
      break
    case 'date':
      this.reminderDate = e.target.value
      break
    case 'remark':
      this.remark = e.target.value
      break
    case 'email':
      this.email = e.target.value
      break
    }
  }

  selectDate = date => {
    //console.log('selectDate', date, moment(date).format('DD-MM-YYYY'))
    this.reminderDate = moment(date).format('DD-MM-YYYY')
  }

  addReminder = () => {
    //temp until DatePicker implementation... note, take from DD-MM-YYYY HH:mm format
    const _date = moment(`${this.reminderDate} ${this.time}`, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss')
    //console.log(_date)
    const action = this.reminderID > 0 ? 'Update' : 'Add'
    setReminder(action, this.reminderID, this.tenderID, this.remark, this.subject, this.email, _date).then(saved => {
      console.log('saved status:', saved) //implement if user should know something about save op
      clearCache()
      this.props.onClose() //...close the modal
    })
    if (this.email != '') {
      setCookie('userEmail', this.email)
    }
  }

  delReminder = () => {
    setReminder('Delete', this.reminderID, -1, '', '', '').then(deleted => {
      console.log('delete status:', deleted) //implement if user should know something about delete op
      clearCache()
      this.props.onClose() //...close the modal
    })
  }

  render() {
    const {onClose, infoDate, t} = this.props
    const title = this.subject
    const dateVal = moment(this.reminderDate, 'DD-MM-YYYY').format('DD-MM-YYYY')
    const timeVal = this.time != '' ? this.time : moment(this.reminderDate, 'DD-MM-YYYY').format('HH:mm')
    const infoDateVal = infoDate != null ? moment(infoDate, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY') : t('reminder.noDate')
    //console.log('render reminder', this.reminderDate)
    return (
      <div className="reveal-overlay" style={{display: 'block', zIndex: 1100}}>
        <div className="reveal" styleName="reminder_lb" style={{display: 'block'}}>
          <button styleName="button-cancel" onClick={onClose}>×</button>
          <div className="grid-x grid-margin-x" styleName="pb">
            <div className="small-12 cell">
              <h2 styleName="remider_ttl">{t('reminder.title')}</h2>
            </div>
          </div>

          <div className="grid-x grid-margin-x" styleName="pb">
            <div className="small-12 cell">
              <span>{t('reminder.subject')}</span>
              <input type="text" name="subject" value={title} onChange={this.updateField}/>
            </div>
          </div>

          <div className="grid-x grid-margin-x" styleName="pb">

            <div className="small-6 cell">
              <span>{t('reminder.date')}</span>
              <Calendar
                defaultDate={moment(this.reminderDate, 'DD-MM-YYYY')}
                todayLabel={t('reminder.today')}
                selectDate={this.selectDate}
                showMonths={false}
                showYears={false}
              />
              <span styleName="note">{t('reminder.delivery', {infoDateVal})}</span>
            </div>

            <div className="small-6 cell">
              <span>{t('reminder.time')}</span>
              <input type="text" name="time" value={timeVal} onChange={this.updateField} />
            </div>
          </div>

          <div className="grid-x grid-margin-x" styleName="pb">
            <div className="small-12 cell">
              <span>{t('reminder.email')}</span>
              <input type="email" name="email" value={this.email} onChange={this.updateField}/>
            </div>
          </div>

          <div className="grid-x grid-margin-x" styleName="pb">
            <div className="small-12 cell">
              <span>{t('reminder.remark')}</span>
              <textarea styleName="remark" name="remark" value={this.remark} onChange={this.updateField} />
            </div>
          </div>

          <div className="grid-x grid-margin-x" styleName="buttons_cont">
            <div className="small-12 cell">

              {this.reminderID > 0 &&
                <button styleName="button-remove" onClick={this.delReminder}>{t('reminder.delete')}</button>
              }
              <button styleName="button-submit" onClick={this.addReminder}>{t('reminder.submit')}</button>
            </div>
          </div>

        </div>
      </div>

    )
  }
}
