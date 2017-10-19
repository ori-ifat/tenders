import React from 'react'
import { inject, observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './HomeTitle.scss'

@translate()
@inject('homeStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class HomeTitle extends React.Component {

  render() {
    const { t, homeStore } = this.props
    const { resultsLoading, resultsCount } = homeStore
    const count = resultsCount

    return (
      <div styleName="row">
        <div styleName="large-12 columns">
          {!resultsLoading &&
            <div>
              <h5 styleName="user-greet">{t('home.greet')}</h5>
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
