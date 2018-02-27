import React from 'react'
import { string, func } from 'prop-types'
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
    dateField: string,
    chooseDateField: func
  }

  @observable startDate = moment()
  @observable endDate = moment()

  componentWillMount() {
    const {dateField, chooseDateField} = this.props
    chooseDateField(dateField)
  }

  componentWillReceiveProps(nextProps) {
    const {dateField, chooseDateField} = nextProps
    chooseDateField(dateField)
  }

  selectDate = (dateParam) => {
    //set observables and doFilter
    const {searchStore, dateField} = this.props
    if (dateField == 'publishdate') {
      this.startDate = moment().subtract(1, dateParam)
      this.endDate = moment()
    }
    else {
      //infoDate
      this.startDate = moment().hour(0).minute(0).second(0)
      this.endDate = moment().add(1, dateParam)
    }
    searchStore.initialDate = false
    this.doFilter()
  }

  doFilter = () => {
    //filter commit
    const { searchStore, dateField, t } = this.props
    this.endDate = this.endDate.hour(23).minute(59).second(59)  //include all last day.
    const values = [
      moment(this.startDate).format('YYYY-MM-DD'),
      this.endDate.format('YYYY-MM-DD HH:mm:ss')
    ]
    //console.log('values', values)
    doFilter(searchStore, dateField, values)
    //set the state-like object:
    //the actual values (date field name was already set on DateFilter)
    searchStore.setSelectedFilters(dateField, values, t('filter.more'))
  }

  render() {
    const {dateField, t} = this.props
    const timeCaption = dateField == 'publishdate' ? 'last' : 'next'
    return(
      <div>
        <div className="grid-x">

          <div className="small-12 cell" style={{paddingTop: '10px'}}>
            <a styleName="date-button first" onClick={() => this.selectDate('day')}>{t(`filter.${timeCaption}Day`)}</a>
            <a styleName="date-button" onClick={() => this.selectDate('week')}>{t(`filter.${timeCaption}Week`)}</a>
            <a styleName="date-button" onClick={() => this.selectDate('month')}>{t(`filter.${timeCaption}Month`)}</a>
          </div>

        </div>
      </div>
    )
  }
}
