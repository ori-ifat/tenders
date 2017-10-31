import React, {Component} from 'react'
import { translate } from 'react-polyglot'
import moment from 'moment'
import {addReminder} from 'common/services/apiService'
import CSSModules from 'react-css-modules'
import styles from './Reminder.scss'

@translate()
//@observer
@CSSModules(styles, { allowMultiple: true })
export default class Reminder extends Component {

  addReminder = () => {
    
  }

  render() {
    const {title, date, onCancel, t} = this.props
    const dateVal = moment(date).format('DD-MM-YYYY')
    const timeVal = moment(date).format('HH:mm')

    return (
      <div className="reveal-overlay" style={{display: 'block'}}>
        <div className="reveal tiny" style={{display: 'block'}}>
          <h2>{t('reminder.title')}</h2>
          <div>
            <span>{t('reminder.subject')}</span>
            <input type="text" value={title} />
          </div>
          <div styleName="clearfix">
            <div styleName="time">
              <span>{t('reminder.time')}</span>
              <input type="text" value={timeVal} />
            </div>
            <div styleName="date">
              <span>{t('reminder.date')}</span>
              <input type="text" value={dateVal} />
            </div>
            <span>{t('reminder.delivery', {dateVal})}</span>
          </div>
          <div>
            <span>{t('reminder.remark')}</span>
            <textarea />
          </div>
          <div styleName="button-container">
            <button styleName="button-cancel" onClick={onCancel}>{t('reminder.cancel')}</button>
            <button styleName="button-submit">{t('reminder.submit')}</button>
          </div>
        </div>
      </div>
    )
  }
}
