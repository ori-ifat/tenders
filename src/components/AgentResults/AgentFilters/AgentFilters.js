import React from 'react'
import { inject, observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import moment from 'moment'
import MultipleFilter from 'components/Results/Filters/MultipleFilter'
import TenderTypeFilter from 'components/Results/Filters/TenderTypeFilter'
import DateFilter from 'components/Results/Filters/DateFilter'
import DateButtons from 'components/Results/Filters/DateButtons'
import SearchTextFilter from 'components/Results/Filters/SearchTextFilter'
import Loading from 'common/components/Loading/Loading'
import CSSModules from 'react-css-modules'
import styles from './AgentFilters.scss'

@translate()
@inject('agentStore')
@CSSModules(styles)
@observer
export default class AgentFilters extends React.Component {

  cleanFilters = () => {
    const {agentStore} = this.props
    agentStore.filters.clear()
    agentStore.clearFilterLabels()
    //agentStore.clearResults()
    agentStore.fromRoute = true  //raise route flag
    agentStore.initialDate = true //for last month label...
    agentStore.loadNextResults()
    agentStore.loadNextFilters() //cached, but will allow filters to be unchecked on child components
  }

  render() {
    const {agentStore, agentStore: {resultsLoading, filtersLoading, selectedFilters}, t} = this.props
    //note: selectedFilters - should maintain the state of child filter components, after this component recreates;
    const subsubjects = selectedFilters ? selectedFilters.subsubjects : ''
    const publishers = selectedFilters ? selectedFilters.publishers : ''
    const dateField = selectedFilters ? selectedFilters.dateField || 'publishdate' : 'publishdate'

    const defaultDates = [moment().subtract(6, 'month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    const dateValues = selectedFilters && selectedFilters.date ? selectedFilters.date[dateField] || defaultDates : defaultDates
    const text = selectedFilters ? selectedFilters.searchText : ''

    return(
      <div styleName="filter_container">
        <div styleName="filter_ttl">
          <a styleName="clean" onClick={this.cleanFilters}>{t('filter.clean')}</a>
          <h4>{t('filter.title')}:</h4>
        </div>
        {(filtersLoading || resultsLoading) && <Loading />}
        {!filtersLoading &&

          <div>
            <MultipleFilter
              type="subsubjects"
              items={agentStore.availableFilters.SubSubjects}
              label={subsubjects}
              store={agentStore}
              search="agent"
            />
            <TenderTypeFilter
              items={agentStore.availableFilters.TenderTypes}
              store={agentStore}
            />
            <MultipleFilter
              type="publishers"
              items={agentStore.availableFilters.Publishers}
              label={publishers}
              store={agentStore}
              search="agent"
            />
            <DateFilter
              dateField={dateField}
              dateValues={dateValues}
              store={agentStore}
            />
            <DateButtons
              dateField={dateField}
              store={agentStore}
            />
            <SearchTextFilter
              text={text}
              store={agentStore}
            />

          </div>
        }
      </div>
    )
  }
}
