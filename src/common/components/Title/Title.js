import React from 'react'
import { inject, observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import ExtraCount from 'components/results/ExtraCount'
import CSSModules from 'react-css-modules'
import styles from './Title.scss'

@translate()
@inject('accountStore')
@CSSModules(styles)
@observer
export default class Title extends React.Component {

  render() {
    const { mode, t, store, accountStore: { profile } } = this.props
    const { resultsLoading, resultsCount } = store
    const title = mode == 'favorites' ? t('favorites.title') : t('results.title')
    return (
      <div className="row">
        <div className="large-12 columns">
          {!resultsLoading &&
            <h1 styleName="results_summery"><span>{resultsCount}</span> {title} </h1>
          }
          {!resultsLoading &&
            store.filters &&
            store.filters.length == 0
            && profile
            && profile.restricted
            &&
            <ExtraCount
              total={resultsCount}
            />}
          {resultsLoading &&
            <h1 styleName="results_summery">{t('loading')}</h1>
          }
        </div>

      </div>
    )
  }
}
