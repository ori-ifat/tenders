import React from 'react'
import { array } from 'prop-types'
import { observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './Toolbar.scss'

const req = require.context('common/style/icons/', false)
const emailSrc = req('./mail.png')
const printSrc = req('./print.svg')
const actionFavSrv = req('./action_fav.svg')

@translate()
@CSSModules(styles, {allowMultiple: true})
@observer
export default class Toolbar extends React.Component {

  static propTypes = {
    checkedItems: array
  }

  email = () => {
    console.log('email', this.props.checkedItems)
  }

  print = () => {
    console.log('print', this.props.checkedItems)
  }

  addFavorites = () => {
    console.log('addFavorites', this.props.checkedItems)
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
                  <li><a onClick={this.addFavorites}><img src={actionFavSrv} alt={t('toolbar.fav')} /></a></li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      </div>
    )
  }
}
