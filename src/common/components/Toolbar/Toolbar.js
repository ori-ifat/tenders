import React from 'react'
import { array, object, func } from 'prop-types'
import { inject, observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import remove from 'lodash/remove'
import find from 'lodash/find'
import {createUrl, addToFavorites, getEmailData, clearCache} from 'common/services/apiService'
import CSSModules from 'react-css-modules'
import styles from './Toolbar.scss'

const req = require.context('common/style/icons/', false)
const emailSrc = req('./mail.png')
const printSrc = req('./print.svg')
const actionFavSrc = req('./action_fav.svg')

const extractItems = (checkedItems) => {
  const itemsToAdd = []
  checkedItems.map(item => {
    itemsToAdd.push(item.TenderID)
  })
  return itemsToAdd
}

@translate()
@inject('accountStore')
@CSSModules(styles, {allowMultiple: true})
@observer
export default class Toolbar extends React.Component {

  static propTypes = {
    checkedItems: object,
    onClose: func,
    notlogged: func
  }

  email = () => {
    //console.log('email', this.props.checkedItems)
    const {accountStore, checkedItems, onClose, notlogged, t} = this.props
    if (accountStore.profile) {
      const itemsToAdd = extractItems(checkedItems)
      getEmailData(itemsToAdd).then(uid =>
        //console.log('email', uid)
        location.href = `mailto:someone@email.com?subject=${t('toolbar.emailSubject')}&body=${encodeURIComponent(t('toolbar.emailBody', {uid}))}`
      )
      onClose()
    }
    else {
      notlogged()
    }
  }

  print = () => {
    //console.log('print', this.props.checkedItems)
    const {accountStore, checkedItems, onClose, notlogged} = this.props
    if (accountStore.profile) {
      const itemsToAdd = extractItems(checkedItems)
      window.open(createUrl('Export/ExportData', {
        ExportType: 1,
        InfoList: itemsToAdd
      }, false), '_blank')
      onClose()
    }
    else {
      notlogged()
    }
  }

  addFavorites = () => {
    //console.log('addFavorites', this.props.checkedItems)
    const {accountStore, checkedItems, onClose, notlogged} = this.props
    if (accountStore.profile) {
      const itemsToAdd = extractItems(checkedItems)
      //iterate over the relevant items, and change IsFavorite state on original array
      //(this will cause the list to re-render, and show fav state on ResultsItem)
      itemsToAdd.map(tenderID => {
        const found = find(checkedItems, item => {
          return item.TenderID == tenderID
        })
        if (found) {
          //if item is in checkedItems array, need to update its fav state
          remove(checkedItems, item => {
            return item.TenderID === tenderID
          })
          //add the item again with new fav state
          checkedItems.push({ TenderID: tenderID, IsFavorite: true })
        }
      })
      //call api with items and add action
      addToFavorites('Favorite_add', itemsToAdd)
      clearCache()
      onClose()
      //console.log(checkedItems, itemsToAdd)
    }
    else {
      notlogged()
    }
  }

  render() {
    const {checkedItems, t} = this.props
    const toolBarStyle = checkedItems.length > 0 ? 'action_bar active' : 'action_bar'
    return (
      <div id="action_bar" styleName={toolBarStyle} >
        <div className="grid-container">

          <div styleName="action_bar_wraper">

            <div className="grid-x">

              <div className="small-9 cell">
                <span>{checkedItems.length} {t('toolbar.selectedTenders')}</span>
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
      </div>
    )
  }
}
