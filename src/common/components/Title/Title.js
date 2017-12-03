import React from 'react'
import { inject, observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './Title.scss'

@translate()
@inject('searchStore')
@CSSModules(styles)
@observer
export default class Title extends React.Component {

  render() {
    const { mode, t, store } = this.props
    const { resultsLoading, resultsCount } = store
    const title = mode == 'favorites' ? t('favorites.title') : t('results.title')
    return (
      <div className="row">
        <div className="large-12 columns">
          {!resultsLoading &&
            <h1 styleName="results_summery"><span>{resultsCount}</span> {title} </h1>
          }
          {resultsLoading &&
            <h1 styleName="results_summery">{t('loading')}</h1>
          }
        </div>

      </div>
    )
  }
}
