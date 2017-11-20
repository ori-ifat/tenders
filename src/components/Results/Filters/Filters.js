import React from 'react'
import { object, func } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import MultipleFilter from './MultipleFilter'
import TenderTypeFilter from './TenderTypeFilter'
import DateFilter from './DateFilter'
import CSSModules from 'react-css-modules'
import styles from './Filters.scss'

@translate()
@inject('searchStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class Filters extends React.Component {

  static propTypes = {
    selectedFilters: object,
    setSelected: func
  }

  render() {
    const {searchStore, setSelected, selectedFilters} = this.props
    //note: selectedFilters - should maintain the state of child filter components, after this component recreates;
    //setSelected: a func on Results component that sets it
    const subsubjects = selectedFilters ? selectedFilters.subsubjects : ''
    const publishers = selectedFilters ? selectedFilters.publishers : ''
    const dateField = selectedFilters ? selectedFilters.dateField || 'publishdate' : 'publishdate'
    const dateValues = selectedFilters && selectedFilters.date ? selectedFilters.date[dateField] || [] : []
    //console.log('filters', toJS(searchStore.availableFilters))

    return(
      <div styleName="filter_container">
        
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
          <div styleName="">
            <h4>חפש בתוצאות</h4>
            <input type="text" placeholder="חפש"></input>
          </div>
          
        </div>
      </div>
    )
  }
}
