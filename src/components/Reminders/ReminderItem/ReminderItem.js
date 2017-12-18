import React from 'react'
import { number, string, func, bool } from 'prop-types'
import { translate } from 'react-polyglot'
import moment from 'moment'
import CSSModules from 'react-css-modules'
import styles from './ReminderItem.scss'

@translate()
@CSSModules(styles, {allowMultiple: true})
export default class ReminderItem extends React.Component {
  static propTypes = {
    reminderID: number,
    title: string,
    date: string,
    infoDate: string,
    selectItem: func,
    isSelected: bool
  }

  render() {
    const { reminderID, title, date, infoDate, selectItem, isSelected, t } = this.props
    //determine the date tabel
    const reminderDate = moment(date, 'YYYY-MM-DD HH:mm').startOf('day').isSame(moment().startOf('day')) ?
      `${t('reminders.today')} ${moment(date, 'YYYY-MM-DD HH:mm').format('HH:mm')}` :
      moment(date, 'YYYY-MM-DD HH:mm').format('DD/MM/YY')
    //style fix
    const style = isSelected ? 'record selected' : 'record'

    return (
      <div styleName={style} onClick={() => selectItem(reminderID)}>
        <div styleName="clearfix">
          <h5 styleName="record-title">{title}</h5><h6 styleName="record-date">{reminderDate}</h6>
        </div>
        <h6 styleName="record-infodate">{`${t('reminders.infoDate')} ${moment(infoDate, 'YYYY-MM-DD HH:mm').format('DD/MM/YY')}`}</h6>
      </div>
    )
  }
}
