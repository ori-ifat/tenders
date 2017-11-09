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

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  doFilter = () => {
    
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
