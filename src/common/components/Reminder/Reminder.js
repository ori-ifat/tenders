import React, {Component} from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { translate } from 'react-polyglot'
import moment from 'moment'
import {setReminder, getReminder} from 'common/services/apiService'
import Calendar from 'common/components/Calendar'
import CSSModules from 'react-css-modules'
import styles from './Reminder.scss'

@translate()
@observer
@CSSModules(styles, { allowMultiple: true })
export default class Reminder extends Component {

  @observable tenderID = -1
  @observable subject = '';
  @observable time = '';
  @observable reminderDate;
  @observable remark = '';
  @observable reminderID = 0

  componentWillMount() {
    const {tenderID, title, infoDate, reminderID} = this.props
    //console.log('mount', infoDate)
    this.tenderID = tenderID
    if (!reminderID) {
      this.subject = title
      this.reminderDate = moment(infoDate, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY')
      this.time = '00:00'
      this.remark = ''
    }
    else {
      this.reminderID = reminderID
      this.getReminderData(reminderID)
    }
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
    setReminder(action, this.reminderID, this.tenderID, this.remark, this.subject, _date).then(saved => {
      console.log('saved status:', saved) //implement if user should know something about save op
      this.props.onCancel() //...close the modal
    })
  }

  delReminder = () => {
    setReminder('Delete', this.reminderID, -1, '', '', '').then(deleted => {
      console.log('delete status:', deleted) //implement if user should know something about save op
      this.props.onCancel() //...close the modal
    })
  }

  render() {
    const {onCancel, infoDate, t} = this.props
    const title = this.subject
    const dateVal = moment(this.reminderDate, 'DD-MM-YYYY').format('DD-MM-YYYY')
    const timeVal = moment(this.reminderDate, 'DD-MM-YYYY').format('HH:mm')
    const infoDateVal = moment(infoDate, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY')
    //console.log('render reminder', this.reminderDate)
    return (
      <div className="reveal-overlay" style={{display: 'block'}}>
        <div className="reveal tiny" style={{display: 'block'}}>
          <h2>{t('reminder.title')}</h2>
          <div>
            <span>{t('reminder.subject')}</span>
            <input type="text" name="subject" value={title} onChange={this.updateField}/>
          </div>
          <div styleName="clearfix">
            <div styleName="time">
              <span>{t('reminder.time')}</span>
              <input type="text" name="time" value={timeVal} onChange={this.updateField} />
            </div>
            <div styleName="date">
              <span>{t('reminder.date')}</span>
              {/*<input type="text" name="date" value={dateVal} onChange={this.updateField} />*/}
              {<Calendar
                defaultDate={this.reminderDate}
                todayLabel={t('reminder.today')}
                selectDate={this.selectDate}
              />}
            </div>
            <span>{t('reminder.delivery', {infoDateVal})}</span>
          </div>
          <div>
            <span>{t('reminder.remark')}</span>
            <textarea name="remark" value={this.remark} onChange={this.updateField} />
          </div>
          <div styleName="button-container">
            <button styleName="button-cancel" onClick={onCancel}>{t('reminder.cancel')}</button>
            {this.reminderID > 0 &&
              <button styleName="button-cancel" onClick={this.delReminder}>{t('reminder.delete')}</button>
            }
            <button styleName="button-submit" onClick={this.addReminder}>{t('reminder.submit')}</button>
          </div>
        </div>
      </div>
    )
  }
}
