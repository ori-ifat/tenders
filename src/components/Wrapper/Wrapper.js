import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import { searchStore, accountStore } from 'stores'
import {setCheckedStatus, setFavStatus} from 'common/utils/util'
import remove from 'lodash/remove'
import find from 'lodash/find'
import map from 'lodash/map'
import Home from 'components/Home'
import Results from 'components/Results'
import Favorites from 'components/Favorites'
import Toolbar from 'common/components/Toolbar'
import CSSModules from 'react-css-modules'
import styles from './wrapper.scss'

@inject('searchStore')
@inject('accountStore')
@CSSModules(styles)
@observer
export default class Wrapper extends Component {

  @observable checkedItems = []   /* this observable holds the state of items: checked\unchecked, favorite true\false. only for touched items */
  @observable selectedFilters = {}

  /*
  cleanChecked = () => {
    this.checkedItems.clear()
  }
  */
  push = (checked, value, isFavorite) => {
    const found = find(this.checkedItems, item => {
      return item.TenderID == value
    })
    if (!found) this.checkedItems.push({ checked, TenderID: value, IsFavorite: isFavorite })
  }

  cut = (value) => {
    remove(this.checkedItems, item => {
      return item.TenderID === value
    })
  }

  extractItems = () => {
    const itemsToAdd = []
    this.checkedItems.map(item => {
      if (item.checked) { //add only ids of checked items
        itemsToAdd.push(item.TenderID)
      }
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
    //console.log(toJS(this.checkedItems))
  }

  onFav = (tenderID, add) => {
    const {accountStore} = this.props
    if (accountStore.profile) {
      setFavStatus(tenderID, add, this.isInChecked, this.push, this.cut)
      //console.log(toJS(this.checkedItems))
    }
    else {
      this.showLoginMsg = true
    }
  }

  hideToolbar = () => {
    //this.checkedItems.clear() //removes all elements.
    //instead: uncheck all. the checkedItems array will stay in tact, with checked state for each element
    this.checkedItems = map(this.checkedItems, item => {
      item.checked = false
      return item
    })
    //console.log(toJS(this.checkedItems))
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
    const Component = use == 'results' ?
      Results :
      use == 'favorites' ?
        Favorites :
        Home

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
        />
      </div>
    )
  }
}
