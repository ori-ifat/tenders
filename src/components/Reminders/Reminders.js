import React, {Component} from 'react'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import {remindersStore} from 'stores'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import {translate} from 'react-polyglot'
import ReminderItem from './ReminderItem'
import SearchInput from 'common/components/SearchInput'
import CSSModules from 'react-css-modules'
import styles from './reminders.scss'

@withRouter
@whenRouted(() => {
  remindersStore.loadAllReminders()
})
@inject('remindersStore')
@translate()
@observer
@CSSModules(styles)
export default class Reminders extends Component {

  @observable itemId = -1

  selectItem = itemId => {
    const {remindersStore} = this.props
    remindersStore.cleanItem()
    remindersStore.loadReminder(itemId).then(() => {
      console.log(toJS(remindersStore.item), itemId)
      this.itemId = itemId
    })
  }

  render() {
    const {remindersStore, t} = this.props
    const {resultsLoading, results} = remindersStore
    return (
      <div>
        <div className="row">
          <div className="column large-12" styleName="search-div">
            <SearchInput />
          </div>
        </div>
        <div className="row" styleName="title-container">
          <div className="column large-12">
            <h1 styleName="title">{t('reminders.title')}</h1>
          </div>
        </div>
        <div className="row">
          <div className="column large-6" >
            {!resultsLoading && results.map((reminder, index) =>
              <ReminderItem
                key={index}
                reminderID={reminder.ReminderID}
                title={reminder.Title}
                date={reminder.ReminderDate}
                infoDate={reminder.ReminderDate}
                infoDateLabel={t('reminders.infoDate')}
                todayLabel={t('reminders.today')}
                selectItem={this.selectItem}
                isSelected={this.itemId == reminder.ReminderID}
              />
            )}
            {resultsLoading && <div>Loading...</div>}
          </div>
          <div className="column large-6" >
            Test 2
          </div>
        </div>
      </div>
    )
  }
}
