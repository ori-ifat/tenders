import React from 'react'
//import { object, func } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import { getDefaultDates } from 'common/utils/filter'
import moment from 'moment'
import find from 'lodash/find'
import filter from 'lodash/filter'
import MultipleFilter from './MultipleFilter'
import ComboFilter from './ComboFilter'
import TenderTypeFilter from './TenderTypeFilter'
import DateFilter from './DateFilter'
import DateButtons from './DateButtons'
import SearchTextFilter from './SearchTextFilter'
import Loading from 'common/components/Loading/Loading'
import CSSModules from 'react-css-modules'
import styles from './Filters.scss'

@translate()
@inject('searchStore')
@CSSModules(styles)
@observer
export default class Filters extends React.Component {

  /*
  static propTypes = {
    selectedFilters: object,
    setSelected: func
  }
  */

  @observable dateField = 'publishdate'

  componentWillMount() {
    //console.log('filters mount')
  }

  componentWillReceiveProps(nextProps) {
    //console.log('filters receive')
    const {searchStore} = this.props
    //only if not committed: create a new filter from subsubject tags - to mark them on MultipleFilter
    if (searchStore.filters.length == 0) {
      //get current tags and check if there are subsubjects in it
      const tags = filter(searchStore.tags, item => {
        return item.ResType == 'subsubject'
      })
      //iterate on tags:
      tags.map(tag => {
        //check if a subsubject filter exists (may be from prev iteration)
        let filter = find(searchStore.filters, item => {
          return item.field == 'subsubject'
        })

        if (!filter) {
          //create new
          filter = {field: 'subsubject', values: [tag.ID]}
        }
        else {
          //concat to values
          if (!filter.values.includes(tag.ID)) filter.values.push(tag.ID)
        }
        //merge with current
        const newFilters = [Object.assign({}, searchStore.filters, filter)]
        //apply newFilters
        const filters = JSON.stringify(newFilters)
        searchStore.applyFilters(filters)
      })
    }
  }

  cleanFilters = () => {
    const {searchStore} = this.props
    searchStore.filters.clear()
    searchStore.clearFilterLabels()
    //searchStore.clearResults()
    searchStore.fromRoute = true  //raise route flag
    searchStore.initialDate = true //for last month label...
    searchStore.loadNextResults()
    searchStore.loadNextFilters() //cached, but will allow filters to be unchecked on child components
  }

  chooseDateField = field => {
    this.dateField = field
    //set the date field name
    const { searchStore, t } = this.props
    searchStore.setSelectedFilters('dateField', this.dateField, t('filter.more'))
  }

  render() {
    const {searchStore, searchStore: {resultsLoading, filtersLoading, selectedFilters, tags}, t} = this.props
    //note: selectedFilters - should maintain the state of child filter components, after this component recreates;
    const subsubjects = selectedFilters ? selectedFilters.subsubjects : ''
    const publishers = selectedFilters ? selectedFilters.publishers : ''
    const dateField = selectedFilters ? selectedFilters.dateField || 'publishdate' : 'publishdate'
    const defaultDates = getDefaultDates(tags)
    const dateValues = selectedFilters && selectedFilters.date ? selectedFilters.date[dateField] || defaultDates : defaultDates
    const text = selectedFilters ? selectedFilters.searchText : ''
    //console.log('filters', toJS(searchStore.availableFilters))
    return(
      <div styleName="filter_container">
        <div styleName="filter_ttl">
          <a styleName="clean" onClick={this.cleanFilters}>{t('filter.clean')}</a>
          <h4>{t('filter.title')}:</h4>
        </div>
        {filtersLoading && <Loading />}
        {!filtersLoading &&

          <div>
            <MultipleFilter
              type="subsubjects"
              items={searchStore.availableFilters.SubSubjects}
              label={subsubjects}
            />
            <TenderTypeFilter
              items={searchStore.availableFilters.TenderTypes}
            />
            <MultipleFilter
              type="publishers"
              items={searchStore.availableFilters.Publishers}
              label={publishers}
            />
            {/*<ComboFilter
              type="publishers"
              items={searchStore.availableFilters.Publishers}
            />*/}
            <DateFilter
              dateField={this.dateField}
              chooseDateField={this.chooseDateField}
              dateValues={dateValues}
            />
            <DateButtons
              dateField={this.dateField}
              chooseDateField={this.chooseDateField}
            />
            <SearchTextFilter
              text={text}
            />

          </div>
        }
      </div>
    )
  }
}
