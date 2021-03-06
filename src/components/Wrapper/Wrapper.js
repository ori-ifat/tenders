import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import {searchStore, accountStore} from 'stores'
import {setCheckedStatus, setFavStatus} from 'common/utils/util'
import {translate} from 'react-polyglot'
import Main from 'components/Main'
import Results from 'components/Results'
import Favorites from 'components/Favorites'
import DistAgent from 'components/DistAgent'
import Toolbar from 'common/components/Toolbar'
import CSSModules from 'react-css-modules'
import styles from './wrapper.scss'

const relevantComponent = (use) => {
  let Component = null
  switch (use) {
  case 'results':
    Component = Results
    break
  case 'favorites':
    Component = Favorites
    break
  case 'distagent':
    Component = DistAgent
    break
  default:
    Component = Main
    break
  }
  return Component
}

@translate()
@inject('searchStore')
@inject('accountStore')
@inject('recordStore')
@CSSModules(styles)
@observer
export default class Wrapper extends Component {

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

  render() {
    const {use} = this.props
    /*const Component = use == 'results' ?
      Results :
      use == 'favorites' ?
        Favorites :
        Main*/
    const Component = relevantComponent(use)
    return (
      <div>
        <Component
          onCheck={this.onCheck}
          onFav={this.onFav}
          showNotification={this.props.showNotification}
        />
        <Toolbar />
      </div>
    )
  }
}
