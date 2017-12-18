import React, {Component} from 'react'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import {remindersStore} from 'stores'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import {translate} from 'react-polyglot'
import ReminderItem from './ReminderItem/ReminderItem'
import SearchInput from 'common/components/SearchInput'
import Reminder from 'common/components/Reminder'
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

  selectItem = (itemId, update) => {  
    this.itemId = itemId
    if (itemId == -1 && update) {
      //called for update\delete - reload items
      const {remindersStore} = this.props
      remindersStore.results.clear()
      remindersStore.loadAllReminders()
    }
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
          <div className="column large-12">
            {!resultsLoading && this.itemId == -1 && results.map((reminder, index) =>
              <ReminderItem
                key={index}
                reminderID={reminder.ReminderID}
                title={reminder.Title}
                date={reminder.ReminderDate}
                infoDate={reminder.InfoDate}
                selectItem={this.selectItem}
                isSelected={this.itemId == reminder.ReminderID}
              />
            )}
            {this.itemId > -1 && !remindersStore.reminderLoading &&
              <div styleName="reminder-container">
                <Reminder
                  onClose={this.selectItem}
                  reminderID={this.itemId}
                  isModal={false}
                />
              </div>
            }
            {resultsLoading && <div>Loading...</div>}
          </div>

        </div>
      </div>
    )
  }
}
