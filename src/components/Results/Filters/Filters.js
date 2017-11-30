import React from 'react'
import { object, func } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import find from 'lodash/find'
import filter from 'lodash/filter'
import MultipleFilter from './MultipleFilter'
import TenderTypeFilter from './TenderTypeFilter'
import DateFilter from './DateFilter'
import SearchTextFilter from './SearchTextFilter'
import CSSModules from 'react-css-modules'
import styles from './Filters.scss'

@translate()
@inject('searchStore')
@CSSModules(styles)
@observer
export default class Filters extends React.Component {

  static propTypes = {
    selectedFilters: object,
    setSelected: func
  }

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
      })}
  }

  render() {
    const {searchStore, searchStore: {resultsLoading, filtersLoading}, setSelected, selectedFilters} = this.props
    //note: selectedFilters - should maintain the state of child filter components, after this component recreates;
    //setSelected: a func on Results component that sets it
    const subsubjects = selectedFilters ? selectedFilters.subsubjects : ''
    const publishers = selectedFilters ? selectedFilters.publishers : ''
    const dateField = selectedFilters ? selectedFilters.dateField || 'publishdate' : 'publishdate'
    const dateValues = selectedFilters && selectedFilters.date ? selectedFilters.date[dateField] || [] : []
    const text = selectedFilters ? selectedFilters.searchText : ''
    //console.log('filters', toJS(searchStore.availableFilters))
    return(
      <div styleName="filter_container">
        {filtersLoading && <div>Loading...</div>}
        {!filtersLoading &&
          <div>
            <MultipleFilter
              type="subsubjects"
              items={searchStore.availableFilters.SubSubjects}
              onClose={setSelected}
              label={subsubjects}
            />
            <TenderTypeFilter
              items={searchStore.availableFilters.TenderTypes}
            />
            <MultipleFilter
              type="publishers"
              items={searchStore.availableFilters.Publishers}
              onClose={setSelected}
              label={publishers}
            />
            <DateFilter
              dateField={dateField}
              dateValues={dateValues}
              onSubmit={setSelected}
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
