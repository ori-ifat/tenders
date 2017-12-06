import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import { searchStore, accountStore } from 'stores'
import {setCheckedStatus, setFavStatus, extractLabel} from 'common/utils/util'
import { translate } from 'react-polyglot'
import Home from 'components/Home'
import Results from 'components/Results'
import Favorites from 'components/Favorites'
import Toolbar from 'common/components/Toolbar'
import CSSModules from 'react-css-modules'
import styles from './wrapper.scss'

@translate()
@inject('searchStore')
@inject('accountStore')
@inject('recordStore')
@CSSModules(styles)
@observer
export default class Wrapper extends Component {

  @observable selectedFilters = {}

  onCheck = (checked, value, isFavorite) => {
    const {recordStore} = this.props
    setCheckedStatus(checked, value, isFavorite, recordStore.push, recordStore.cut)    
  }

  onFav = (tenderID, add) => {
    const {accountStore, recordStore} = this.props
    if (accountStore.profile) {
      setFavStatus(tenderID, add, recordStore.isInChecked, recordStore.push, recordStore.cut)
    }
    else {
      this.showLoginMsg = true
    }
  }

  setSelectedFilters = (label, value) => {
    /* set the selectedFilters object - a state-like object for the filter container.
      need that because the entire object is recreated upon filter commit action */
    const {t} = this.props
    switch (label) {
    case 'subsubject':
      //delete this.selectedFilters.subsubjects
      Reflect.deleteProperty(this.selectedFilters, 'subsubjects')
      const subsubjects = extractLabel(value, t('filter.more'))
      this.selectedFilters.subsubjects = subsubjects
      break
    case 'publisher':
      //delete this.selectedFilters.publishers
      Reflect.deleteProperty(this.selectedFilters, 'publishers')
      const publishers = extractLabel(value, t('filter.more'))
      this.selectedFilters.publishers = publishers
      break
    case 'dateField':
      //delete this.selectedFilters.dateField
      Reflect.deleteProperty(this.selectedFilters, 'dateField')
      this.selectedFilters.dateField = value
      break
    case 'publishdate':
    case 'infodate':
      //delete this.selectedFilters.date
      Reflect.deleteProperty(this.selectedFilters, 'date')
      this.selectedFilters.date = { [label]: value }
      break
    case 'searchText':
      //delete this.selectedFilters.searchText
      Reflect.deleteProperty(this.selectedFilters, 'searchText')
      this.selectedFilters.searchText = value
      break
    }
    //console.log(this.selectedFilters)
  }

  render() {
    const {use} = this.props
    const Component = use == 'results' ?
      Results :
      use == 'favorites' ?
        Favorites :
        Home

    return (
      <div>
        <Component
          setSelectedFilters={this.setSelectedFilters}
          selectedFilters={this.selectedFilters}
          onCheck={this.onCheck}
          onFav={this.onFav}
        />
        <Toolbar />
      </div>
    )
  }
}
