import React from 'react'
import { bool, object, func } from 'prop-types'
import { observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import CSSModules from 'react-css-modules'
import styles from './Calendar.scss'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
//import 'common/style/_datepicker.scss'

@CSSModules(styles)
@observer
export default class Calendar extends React.Component {

  @observable selectedDate

  componentWillMount() {
    //const {defaultDate} = this.props
    //this.selectedDate = moment(defaultDate, 'DD-MM-YYYY') //not working ... needs further work to implement
    this.selectedDate = moment()
    //console.log('mount', this.selectedDate)
  }
  /*
  componentWillReceiveProps(nextProps) {
    const {defaultDate} = nextProps
    this.selectedDate = moment(defaultDate, 'DD-MM-YYYY')
  }
  */
  /*
  getDatetime = () => {
    //console.log('getDatetime', this.selectedDate)
    return moment(this.selectedDate)
  }*/

  dateModified = key => value => {
    this.selectedDate = moment(value)
    //console.log('dateModified', this.selectedDate)
    const {selectDate, name} = this.props
    selectDate(this.selectedDate, name)
  }

  render() {
    //console.log('render calendar', this.selectedDate)
    return (
      <div>
        <DatePicker
          bsSize="lg"
          locale="he-IL"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          selected={this.selectedDate}
          onChange={this.dateModified('selectedDate')}
          todayButton={this.props.todayLabel}
        />
      </div>
    )
  }
}
