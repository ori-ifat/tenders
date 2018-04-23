import React, {Component} from 'react'
import { withRouter } from 'react-router'
//import {observer} from 'mobx-react'
//import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './distagent.scss'

@withRouter
@translate()
@CSSModules(styles)
//@observer
export default class DistAgent extends Component {

  componentWillMount() {
    const { match: {params: { uid }} } = this.props
    console.log(uid)
    //temp patch: redirect to old site page
    location.href = `http://192.118.60.10/DistAgent/DistAgent.aspx?uid=${uid}`
  }


  render() {
    const {t} = this.props

    return (
      <div>
        <div className="row">
          <div className="large-12 columns">
            <div styleName="wait">{t('distagent.wait')}</div>
          </div>
        </div>
      </div>
    )
  }
}
