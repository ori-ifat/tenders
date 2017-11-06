import React from 'react'
import { bool, object, func } from 'prop-types'
import { observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import CSSModules from 'react-css-modules'
import styles from './Calendar.scss'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import 'common/style/_datepicker.scss'

@CSSModules(styles, {allowMultiple: true})
@observer
export default class Calendar extends React.Component {

  getDatetime = field => {
    return moment()
  }

  dateModified = key => value => {
    console.log(key, value)
  }

  render() {
    return (
      <div styleName="ui-filter-date">
        <DatePicker
          bsSize="lg"
          locale="he-IL"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          selected={this.getDatetime('dateStart')}
          onChange={this.dateModified('dateStart')}
          todayButton={this.props.todayLabel}
        />
      </div>
    )
  }
}
