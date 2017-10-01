import React, {Component} from 'react'
import {inject} from 'mobx-react'
import CSSModules from 'react-css-modules'
import styles from './results.scss'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import { searchStore } from 'stores'
import SearchInput from 'components/SearchInput'
import ResultList from 'common/components/ResultList'

@withRouter
@whenRouted(({ params: { sort, tags } }) => {
  searchStore.applySort(sort)
  searchStore.applyTags(tags)
  searchStore.clearResults()
  searchStore.loadNextResults()
})
@inject('searchStore')
@CSSModules(styles)
export default class Results extends Component {

  componentWillMount() {
    //console.log('results component', searchStore.sort, toJS(searchStore.tags))
  }

  render() {

    return (
      <div style={{marginTop: '50px'}}>
        <SearchInput sort="infoDate" />
        <ResultList />
      </div>
    )
  }
}
