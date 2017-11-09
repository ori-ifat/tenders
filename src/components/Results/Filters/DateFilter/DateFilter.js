import React from 'react'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import {doFilter} from 'common/utils/filter'
import Calendar from 'common/components/Calendar'
import CSSModules from 'react-css-modules'
import styles from './DateFilter.scss'

@translate()
@inject('searchStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class DateFilter extends React.Component {

  @observable startDate
  @observable endDate

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  selectDate = (date, field) => {
    //console.log('selectDate', date, moment(date).format('DD-MM-YYYY'))
    switch (field) {
    case 'startDate':
      this.startDate = date
      break
    case 'endDate':
      this.endDate = date
      break
    }
    console.log(this.startDate, this.endDate)
  }

  doFilter = () => {

  }

  render() {
    const {t} = this.props
    return(
      <div>
        Dates
        <div styleName="clearfix">
          <div styleName="start-date">
            <Calendar
              todayLabel={t('reminder.today')}
              selectDate={this.selectDate}
              name="startDate"
            />
          </div>
          <div styleName="end-date">
            <Calendar
              todayLabel={t('reminder.today')}
              selectDate={this.selectDate}
              name="endDate"
            />
          </div>
        </div>
      </div>
    )
  }
}
