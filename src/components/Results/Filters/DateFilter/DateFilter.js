import React from 'react'
import { string, array, object, func } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import {doFilter} from 'common/utils/filter'
import moment from 'moment'
import Calendar from 'common/components/Calendar'
import CSSModules from 'react-css-modules'
import styles from './DateFilter.scss'

@translate()
@inject('searchStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class DateFilter extends React.Component {
  /* component for date range filter */

  static propTypes = {
    dateField: string,
    dateValues: array,
    onSubmit: func
  }

  @observable dateField = 'publishdate'
  @observable startDate = moment()
  @observable endDate = moment()

  componentWillMount() {
    const {dateField, dateValues} = this.props
    this.chooseDateField(dateField)
    this.setDefaultDates(dateValues)
  }

  componentWillReceiveProps(nextProps) {
    const {dateField, dateValues} = nextProps
    this.chooseDateField(dateField)
    this.setDefaultDates(dateValues)
  }

  chooseDateField = field => {
    this.dateField = field
  }

  setDefaultDates = dateValues => {
    //if there is an array of dates, set default dates by it
    this.startDate = dateValues && dateValues.length > 0 ? moment(dateValues[0], 'YYYY-MM-DD') || moment() : moment()
    this.endDate = dateValues  && dateValues.length > 1 ? moment(dateValues[1], 'YYYY-MM-DD') || moment() : moment()
  }

  selectDate = (date, field) => {
    //set observables and doFilter
    switch (field) {
    case 'startDate':
      this.startDate = date
      break
    case 'endDate':
      this.endDate = date
      break
    }
    this.doFilter()
  }

  doFilter = () => {
    //filter commit
    const { searchStore, onSubmit } = this.props
    const values = [
      moment(this.startDate).format('YYYY-MM-DD'),
      moment(this.endDate).format('YYYY-MM-DD')
    ]
    doFilter(searchStore, this.dateField, values)
    //set the state-like object:
    onSubmit('dateField', this.dateField) //...the date field name,
    onSubmit(this.dateField, values)  //the actual values
  }

  render() {
    const {t} = this.props
    const clsLeft = this.dateField == 'infodate' ? 'dates-left selected' : 'dates-left'
    const clsRight = this.dateField == 'publishdate' ? 'dates-right selected' : 'dates-right'

    return(
      <div styleName="dateContainer">
        <div styleName="tabs_container">
          <div styleName={clsLeft} onClick={() => this.chooseDateField('infodate')} style={{cursor: 'pointer'}}>
            {t('filter.infoDate')}
          </div>
          <div styleName={clsRight} onClick={() => this.chooseDateField('publishdate')} style={{cursor: 'pointer'}}>
            {t('filter.publishDate')}
          </div>
        </div>
        <div className="grid-x">
          <div className="small-6 cell">
            <span styleName="date_lable">{t('filter.to')}</span>
            <div>
              <Calendar
                name="startDate"
                defaultDate={this.startDate}
                todayLabel={t('filter.today')}
                selectDate={this.selectDate}
                showMonths={true}
                showYears={true}
              />
            </div>
          </div>

          <div className="small-6 cell">
            <span styleName="date_lable">{t('filter.from')}</span>

            <div>
              <Calendar
                name="endDate"
                defaultDate={this.endDate}
                todayLabel={t('filter.today')}
                selectDate={this.selectDate}
                showMonths={true}
                showYears={true}
              />
            </div>

          </div>

        </div>
      </div>
    )
  }
}
