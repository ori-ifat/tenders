import React, {Component} from 'react'
import { string, number, func } from 'prop-types'
import { /*inject,*/ observer } from 'mobx-react'
import { observable } from 'mobx'
import { translate } from 'react-polyglot'

import CSSModules from 'react-css-modules'
import styles from './Definition.scss'

@translate()
@observer
@CSSModules(styles)
export default class Definition extends Component {

  static propTypes = {
    tenderID: number,
    onClose: func
  }

  @observable tenderID = -1

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  updateField = e => {
    //console.log('updateField', e.target.name, e.target.value)
    switch (e.target.name) {
    case 'email':
      this.email = e.target.value
      break
    }
  }

  render() {
    const {onClose, t} = this.props

    return (
      <div className="reveal-overlay" style={{display: 'block', zIndex: 1100}}>
        <div className="reveal" styleName="definition_lb" style={{display: 'block'}}>
          <button styleName="button-cancel" onClick={onClose}>×</button>
          <div className="grid-x grid-margin-x" styleName="pb">
            <div className="small-12 cell">
              <h2 styleName="definition_ttl">{t('agent.definitionTitle')}</h2>
            </div>
          </div>

          <div className="grid-x grid-margin-x" styleName="buttons_cont">
            <div className="small-12 cell">
              <button styleName="button-submit" onClick={this.addReminder}>{t('agent.definitionSubmit')}</button>
            </div>
          </div>

        </div>
      </div>

    )
  }
}
