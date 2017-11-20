import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import { searchStore, accountStore } from 'stores'
import {setCheckedStatus, setFavStatus} from 'common/utils/util'
import remove from 'lodash/remove'
import find from 'lodash/find'
import Home from 'components/Home'
import Results from 'components/Results'
import Toolbar from 'common/components/Toolbar'
import CSSModules from 'react-css-modules'
import styles from './wrapper.scss'

@inject('searchStore')
@inject('accountStore')
@CSSModules(styles)
@observer
export default class Wrapper extends Component {

  @observable checkedItems = []
  @observable selectedFilters = {}

  cleanChecked = () => {
    this.checkedItems.clear()
  }

  push = (value, isFavorite) => {
    const found = find(this.checkedItems, item => {
      return item.TenderID == value
    })
    if (!found) this.checkedItems.push({ TenderID: value, IsFavorite: isFavorite })
  }

  cut = (value) => {
    remove(this.checkedItems, item => {
      return item.TenderID === value
    })
  }

  extractItems = () => {
    const itemsToAdd = []
    this.checkedItems.map(item => {
      itemsToAdd.push(item.TenderID)
    })
    return itemsToAdd
  }

  isInChecked = tenderID => {
    const found = find(this.checkedItems, item => {
      return item.TenderID == tenderID
    })
    return found
  }

  onCheck = (checked, value, isFavorite) => {
    setCheckedStatus(checked, value, isFavorite, this.push, this.cut)
  }

  onFav = (tenderID, add) => {
    const {accountStore} = this.props
    if (accountStore.profile) {
      setFavStatus(this.checkedItems, tenderID, add)
    }
    else {
      this.showLoginMsg = true
    }
  }

  hideToolbar = () => {
    this.checkedItems.clear()
  }

  setSelectedFilters = (label, value) => {
    /* set the selectedFilters object - a state-like object for the filter container.
      need that because the entire object is recreated upon filter commit action */
    switch (label) {
    case 'subsubject':
      //delete this.selectedFilters.subsubjects
      Reflect.deleteProperty(this.selectedFilters, 'subsubjects')
      this.selectedFilters.subsubjects = value
      break
    case 'publisher':
      //delete this.selectedFilters.publishers
      Reflect.deleteProperty(this.selectedFilters, 'publishers')
      this.selectedFilters.publishers = value
      break
    case 'dateField':
      //delete this.selectedFilters.dateField
      Reflect.deleteProperty(this.selectedFilters, 'dateField')
      this.selectedFilters.dateField = value
    case 'publishdate':
    case 'infodate':
      //delete this.selectedFilters.date
      Reflect.deleteProperty(this.selectedFilters, 'date')
      this.selectedFilters.date = { [label]: value }
      break
    }
    //console.log(this.selectedFilters)
  }

  render() {
    const {use} = this.props
    const Component = use == 'results' ? Results : Home

    return (
      <div>
        <Component
          cleanChecked={this.cleanChecked}
          setSelectedFilters={this.setSelectedFilters}
          selectedFilters={this.selectedFilters}
          onCheck={this.onCheck}
          onFav={this.onFav}
          viewDetails={this.viewDetails}
          setReminder={this.setReminder}
          checkedItems={this.checkedItems}
        />
        <Toolbar
          checkedItems={this.checkedItems}
          extractItems={this.extractItems}
          onClose={this.hideToolbar}
          push={this.push}
          cut={this.cut}
          isInChecked={this.isInChecked}
          notlogged={this.notlogged}
        />
      </div>
    )
  }
}
