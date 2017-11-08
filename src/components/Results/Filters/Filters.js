import React from 'react'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import SubSubjectsFilter from './SubSubjectsFilter'
import CSSModules from 'react-css-modules'
import styles from './Filters.scss'

@translate()
@inject('searchStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class Filters extends React.Component {

  @observable selectedBranches = ''

  componentWillMount() {
    //debugger
  }

  componentWillReceiveProps(nextProps) {
    //debugger
  }

  render() {
    const {searchStore, subsubjects, setLabel} = this.props
    console.log('filters', toJS(searchStore.availableFilters))
    return(
      <div>
        <div style={{margin: '1rem 0 1.5rem 0'}}>&nbsp;</div>
        <div>
          <SubSubjectsFilter
            items={searchStore.availableFilters.SubSubjects}
            onClose={setLabel}
            label={subsubjects}
          />
          <div>Tender Type</div>
          <div>Publishers</div>
          <div>Dates</div>
          <div>Free Search</div>
        </div>
      </div>
    )
  }
}
