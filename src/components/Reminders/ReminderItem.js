import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import CSSModules from 'react-css-modules'
import styles from './reminders.scss'

const ReminderItem = ({reminderID, title, date, infoDate, infoDateLabel, todayLabel, selectItem, isSelected}) => {
  //determine the date tabel
  const reminderDate = moment(date, 'YYYY-MM-DD HH:mm').startOf('day').isSame(moment().startOf('day')) ?
    `${todayLabel} ${moment(date, 'YYYY-MM-DD HH:mm').format('HH:mm')}` :
    moment(date, 'YYYY-MM-DD HH:mm').format('DD/MM/YY')
  //style fix
  const style = isSelected ? 'record selected' : 'record'

  return <div styleName={style} onClick={() => selectItem(reminderID)}>
    <div styleName="clearfix">
      <h5 styleName="record-title">{title}</h5><h6 styleName="record-date">{reminderDate}</h6>
    </div>
    <h6 styleName="record-infodate">{`${infoDateLabel} ${moment(infoDate, 'YYYY-MM-DD HH:mm').format('DD/MM/YY')}`}</h6>
  </div>
}

export default CSSModules(ReminderItem, styles, {allowMultiple: true})
