import React from 'react'
import { inject, observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import Loading from 'common/components/Loading/Loading'
import CSSModules from 'react-css-modules'
import styles from './MainTitle.scss'

@translate()
@inject('mainStore')
@inject('accountStore')
@CSSModules(styles)
@observer
export default class MainTitle extends React.Component {

  render() {
    const { t, mainStore, accountStore: { profile } } = this.props
    const { resultsLoading /*, resultsCount*/ } = mainStore
    const resultsCount = mainStore.results.length
    const user = profile ? decodeURIComponent(profile.contactName).replace(/\+/g, ' ') : ''
    //const count = resultsCount
    //t('main.title', {count})
    return (
      <div className="row">
        <div className="large-12 columns">
          {!resultsLoading &&
            <div>
              <h5 styleName="user-greet">{t('main.greet', {user})}</h5>
              <h1 styleName="results_summery">{resultsCount > 0 ? t('main.title2') : t('main.noResults')}</h1>
            </div>
          }
          {resultsLoading &&
            <Loading />
          }
        </div>

      </div>
    )
  }
}
