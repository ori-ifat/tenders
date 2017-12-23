import React from 'react'
import { number, string, func } from 'prop-types'
import { translate } from 'react-polyglot'
import moment from 'moment'
import {setReminder, clearCache} from 'common/services/apiService'
import CSSModules from 'react-css-modules'
import styles from './ReminderItem.scss'

const req = require.context('common/style/icons/', false)
const alertSrc = req('./alert.svg')

@translate()
@CSSModules(styles, {allowMultiple: true})
export default class ReminderItem extends React.Component {
  static propTypes = {
    reminderID: number,
    title: string,
    date: string,
    infoDate: string,
    selectItem: func,
    reload: func
  }

  delReminder = (reminderID) => {
    setReminder('Delete', reminderID, -1, '', '', '').then(deleted => {
      console.log('delete status:', deleted) //implement if user should know something about delete op
      clearCache()
      this.props.reload()
    })
  }


  render() {
    const { reminderID, title, date, infoDate, selectItem, isSelected, t } = this.props
    //determine the date tabel
    const reminderDate = moment(date, 'YYYY-MM-DD HH:mm').startOf('day').isSame(moment().startOf('day')) ?
      `${t('reminders.today')} ${moment(date, 'YYYY-MM-DD HH:mm').format('HH:mm')}` :
      moment(date, 'YYYY-MM-DD HH:mm').format('DD/MM/YY')

    return (
      <div styleName="record">
        <div className="grid-x">
          <div className="large-2 cell">

            <h3 styleName="record-infodate">{reminderDate}</h3>
            <span styleName="time">10:50</span>
          </div>
          <div className="large-10 cell">

            <h3 styleName="record-title">{title}</h3>
            <span> {`${t('reminders.infoDate')} ${moment(infoDate, 'YYYY-MM-DD HH:mm').format('DD/MM/YY')}`}</span>
            <a onClick={() => selectItem(reminderID)}>ערוך</a>
            <a onClick={() => this.delReminder(reminderID)} style={{paddingLeft: '10px'}}>מחק</a>
          </div>


        </div>
      </div>
    )
  }
}
