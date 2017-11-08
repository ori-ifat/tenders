import React from 'react'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import Calendar from 'common/components/Calendar'
import CSSModules from 'react-css-modules'
import styles from './DateFilter.scss'

@translate()
@inject('searchStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class DateFilter extends React.Component {

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  doFilter = () => {
    const { searchStore, onClose } = this.props
    //get current search params
    const sort = searchStore.sort
    const payload = JSON.stringify(searchStore.tags)
    //get current filters and concat new ones
    const newFilters = [...searchStore.filters, {field: 'tendertype', values: this.selected}]
    const filters = JSON.stringify(newFilters)
    //apply filters to store, and commit search:
    searchStore.applyFilters(filters)
    searchStore.clearResults()
    searchStore.loadNextResults()
  }

  render() {
    const {t} = this.props
    return(
      <div>
        Dates
        <Calendar todayLabel={t('reminder.today')} />
      </div>
    )
  }
}
