import React from 'react'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import SubSubjectsFilter from './SubSubjectsFilter'
import TenderTypeFilter from './TenderTypeFilter'
import DateFilter from './DateFilter'
import CSSModules from 'react-css-modules'
import styles from './Filters.scss'

@translate()
@inject('searchStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class Filters extends React.Component {

  componentWillMount() {
    //debugger
  }

  componentWillReceiveProps(nextProps) {
    //debugger
  }

  render() {
    const {searchStore, setSelected, selectedFilters} = this.props
    const subsubjects = selectedFilters ? selectedFilters.subsubjects : ''
    console.log('filters', toJS(searchStore.availableFilters))
    return(
      <div>
        <div style={{margin: '1rem 0 1.5rem 0'}}>&nbsp;</div>
        <div>
          <SubSubjectsFilter
            items={searchStore.availableFilters.SubSubjects}
            onClose={setSelected}
            label={subsubjects}
          />
          <TenderTypeFilter
            items={searchStore.availableFilters.TenderTypes}
          />
          <div>Publishers</div>
          <DateFilter />
          <div>Free Search</div>
        </div>
      </div>
    )
  }
}
