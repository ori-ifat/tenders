import React from 'react'
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

  @observable dateField = 'publishdate'
  @observable startDate = moment()
  @observable endDate = moment()

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  chooseDateField = field => {
    this.dateField = field
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
    //console.log(this.startDate, this.endDate)
    this.doFilter()
  }

  doFilter = () => {
    const { searchStore } = this.props
    const values = [
      moment(this.startDate).format('YYYY-MM-DD'),
      moment(this.endDate).format('YYYY-MM-DD')
    ]
    doFilter(searchStore, this.dateField, values)
    /* pass state object of filters from results to filter! */
  }

  render() {
    const {t} = this.props
    const clsLeft = this.dateField == 'infodate' ? 'dates-left selected' : 'dates-left'
    const clsRight = this.dateField == 'publishdate' ? 'dates-right selected' : 'dates-right'

    return(
      <div>
        <div styleName="clearfix">
          <div styleName={clsLeft} onClick={() => this.chooseDateField('infodate')} style={{cursor: 'pointer'}}>
            {t('filter.infoDate')}
          </div>
          <div styleName={clsRight} onClick={() => this.chooseDateField('publishdate')} style={{cursor: 'pointer'}}>
            {t('filter.publishDate')}
          </div>
        </div>
        <div styleName="clearfix">
          <div styleName="dates-left">{t('filter.to')}</div>
          <div styleName="dates-right">{t('filter.from')}</div>
        </div>
        <div styleName="clearfix">
          <div styleName="start-date">
            <Calendar
              todayLabel={t('filter.today')}
              selectDate={this.selectDate}
              name="startDate"
            />
          </div>
          <div styleName="end-date">
            <Calendar
              todayLabel={t('filter.today')}
              selectDate={this.selectDate}
              name="endDate"
            />
          </div>
        </div>
      </div>
    )
  }
}
