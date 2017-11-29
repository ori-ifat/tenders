import React from 'react'
import { inject, observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './HomeTitle.scss'

@translate()
@inject('homeStore')
@inject('accountStore')
@CSSModules(styles)
@observer
export default class HomeTitle extends React.Component {

  render() {
    const { t, homeStore, accountStore: { profile } } = this.props
    const { resultsLoading, resultsCount } = homeStore
    const count = resultsCount
    const user = profile ? decodeURIComponent(profile.contactName) : ''

    return (
      <div className="row">
        <div className="large-12 columns">
          {!resultsLoading &&
            <div>
              <h5 styleName="user-greet">{t('home.greet', {user})}</h5>
              <h1 styleName="results_summery">{resultsCount > 0 ? t('home.title', {count}) : t('home.noResults')}</h1>
            </div>
          }
          {resultsLoading &&
            <div>Loading...</div>
          }
        </div>

      </div>
    )
  }
}
