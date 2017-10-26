import React from 'react'
import { inject, observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './ResultsTitle.scss'

@translate()
@inject('searchStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class ResultsTitle extends React.Component {

  render() {
    const { t, searchStore } = this.props
    const { resultsLoading, resultsCount } = searchStore

    return (
      <div className="row">
        <div className="large-12 columns">
          {!resultsLoading &&
            <h1 styleName="results_summery"><span>{resultsCount}</span> {t('results.title')} </h1>
          }
          {resultsLoading &&
            <div>Loading...</div>
          }
        </div>

      </div>
    )
  }
}
