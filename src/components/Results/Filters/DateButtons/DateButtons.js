import React from 'react'
import { string } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import {doFilter} from 'common/utils/filter'
import moment from 'moment'
import CSSModules from 'react-css-modules'
import styles from './DateButtons.scss'

@translate()
@inject('searchStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class DateButtons extends React.Component {
  /* component for date range filter */

  static propTypes = {
    dateField: string
  }

  @observable dateField = 'publishdate'
  @observable startDate = moment()
  @observable endDate = moment()

  componentWillMount() {
    const {dateField} = this.props
    this.chooseDateField(dateField)
  }

  componentWillReceiveProps(nextProps) {
    const {dateField} = nextProps
    this.chooseDateField(dateField)
  }

  chooseDateField = field => {
    this.dateField = field
  }

  selectDate = (dateParam) => {
    //set observables and doFilter
    const {searchStore} = this.props
    this.startDate = moment().subtract(1, dateParam)
    searchStore.initialDate = false
    this.doFilter()
  }

  doFilter = () => {
    //filter commit
    const { searchStore, t } = this.props
    this.endDate = this.endDate.hour(23).minute(59).second(59)  //include all last day.
    const values = [
      moment(this.startDate).format('YYYY-MM-DD'),
      this.endDate.format('YYYY-MM-DD HH:mm:ss')
    ]
    //console.log('values', values)
    doFilter(searchStore, this.dateField, values)
    //set the state-like object:
    //...the date field name,
    searchStore.setSelectedFilters('dateField', this.dateField, t('filter.more'))
    //the actual values
    searchStore.setSelectedFilters(this.dateField, values, t('filter.more'))
  }

  render() {
    const {t} = this.props

    return(
      <div>
        <div className="grid-x">

          <div className="small-12 cell" style={{paddingTop: '10px'}}>
            <a styleName="date-button first" onClick={() => this.selectDate('day')}>{t('filter.lastDay')}</a>
            <a styleName="date-button" onClick={() => this.selectDate('week')}>{t('filter.lastWeek')}</a>
            <a styleName="date-button" onClick={() => this.selectDate('month')}>{t('filter.lastMonth')}</a>
          </div>

        </div>
      </div>
    )
  }
}
