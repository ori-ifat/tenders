import React from 'react'
//import { object, func } from 'prop-types'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import { translate } from 'react-polyglot'
import remove from 'lodash/remove'
import find from 'lodash/find'
import {createUrl, addToFavorites, getEmailData, clearCache} from 'common/services/apiService'
import LoginDialog from 'common/components/LoginDialog'
import CSSModules from 'react-css-modules'
import styles from './Toolbar.scss'

const req = require.context('common/style/icons/', false)
const emailSrc = req('./mail.png')
const printSrc = req('./print.svg')
const actionFavSrc = req('./action_fav.svg')

@translate()
@inject('accountStore')
@inject('recordStore')
@CSSModules(styles, {allowMultiple: true})
@observer
export default class Toolbar extends React.Component {
/*
  static propTypes = {
    checkedItems: object,
    onClose: func,
    extractItems: func,
    isInChecked: func,
    push: func,
    cut: func
  }
*/
  @observable showLoginMsg = false

  email = () => {
    /* send email with url to selected tenders */
    const {accountStore, recordStore, t} = this.props
    if (accountStore.profile) {
      const itemsToAdd = recordStore.extractItems()
      getEmailData(itemsToAdd).then(uid =>
        //console.log('email', uid)
        location.href = `mailto:someone@email.com?subject=${t('toolbar.emailSubject')}&body=${encodeURIComponent(t('toolbar.emailBody', {uid}))}`
      )
      //onClose()
      recordStore.cleanChecked()
    }
    else {
      this.showLoginMsg = true
    }
  }

  print = () => {
    /* create pdf from selected tenders */
    const {accountStore, recordStore} = this.props
    if (accountStore.profile) {
      const itemsToAdd = recordStore.extractItems()
      window.open(createUrl('Export/ExportData', {
        ExportType: 1,
        InfoList: itemsToAdd
      }, false), '_blank')
      //onClose()
      recordStore.cleanChecked()
    }
    else {
      this.showLoginMsg = true
    }
  }

  addFavorites = () => {
    /* add selected tenders to favorites */
    const {accountStore, recordStore} = this.props
    if (accountStore.profile) {
      const itemsToAdd = recordStore.extractItems()
      //iterate over the relevant items, and change IsFavorite state on original array
      //(this will cause the list to re-render, and show fav state on ResultsItem)
      itemsToAdd.map(tenderID => {
        const found = recordStore.isInChecked(tenderID)
        //if (found) {
        //old way...: if item is in checkedItems array, need to update its fav state
        //new way: add it anyway because it was touched
        recordStore.cut(tenderID)
        //add the item again with new fav state
        recordStore.push((found && found.checked) || false, tenderID, true)
        //}
      })
      //call api with items and add action
      addToFavorites('Favorite_add', itemsToAdd)
      clearCache()
      //onClose()
      recordStore.cleanChecked()
    }
    else {
      this.showLoginMsg = true
    }
  }

  continueUnlogged = () => {
    this.showLoginMsg = false
  }

  render() {
    const {recordStore: {checkedItems}, t} = this.props
    const relevantItems = checkedItems.filter(item => item.checked || false)
    const toolBarStyle = relevantItems.length > 0 ? 'action_bar active' : 'action_bar'
    return (
      <div id="action_bar" styleName={toolBarStyle} >
        <div className="grid-container">

          <div styleName="action_bar_wraper">

            <div className="grid-x">

              <div className="small-9 cell">
                <span>{relevantItems.length} {t('toolbar.selectedTenders')}</span>
              </div>

              <div className="small-3 cell">
                <ul className="menu align-left" styleName="align-left">
                  <li><a onClick={this.email}><img src={emailSrc} alt={t('toolbar.email')} /></a></li>
                  <li><a onClick={this.print}><img src={printSrc} alt={t('toolbar.print')} /></a></li>
                  <li><a onClick={this.addFavorites}><img src={actionFavSrc} alt={t('toolbar.fav')} /></a></li>
                </ul>
              </div>

            </div>

          </div>
        </div>
        {this.showLoginMsg &&
          <LoginDialog
            onCancel={this.continueUnlogged}
          />
        }
      </div>
    )
  }
}
