import React from 'react'
import { array, object } from 'prop-types'
import { observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import remove from 'lodash/remove'
import find from 'lodash/find'
import {addToFavorites, clearCache} from 'common/services/apiService'
import CSSModules from 'react-css-modules'
import styles from './Toolbar.scss'

const req = require.context('common/style/icons/', false)
const emailSrc = req('./mail.png')
const printSrc = req('./print.svg')
const actionFavSrc = req('./action_fav.svg')

@translate()
@CSSModules(styles, {allowMultiple: true})
@observer
export default class Toolbar extends React.Component {

  static propTypes = {
    checkedItems: object
  }

  email = () => {
    console.log('email', this.props.checkedItems)
  }

  print = () => {
    console.log('print', this.props.checkedItems)
  }

  addFavorites = () => {
    //console.log('addFavorites', this.props.checkedItems)
    const {checkedItems} = this.props
    const itemsToAdd = []
    //fill the items that will be sent to api
    checkedItems.map(item => {
      if (!item.IsFavorite) itemsToAdd.push(item.TenderID)
    })
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
    //console.log(checkedItems, itemsToAdd)
  }

  render() {
    const {checkedItems, t} = this.props
    const toolBarStyle = checkedItems.length > 0 ? 'action_bar active' : 'action_bar'
    return (
      <div id="action_bar" styleName={toolBarStyle} >
        <div styleName="grid-container">

          <div styleName="action_bar_wraper">

            <div styleName="grid-x">

              <div styleName="small-9 cell">
                <span>{checkedItems.length} {t('toolbar.selectedTenders')}</span>
              </div>

              <div styleName="small-3 cell">
                <ul styleName="menu align-left">
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
