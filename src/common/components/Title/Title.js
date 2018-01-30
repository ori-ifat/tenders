import React from 'react'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import { translate } from 'react-polyglot'
import ExtraCount from 'components/results/ExtraCount'
import CSSModules from 'react-css-modules'
import styles from './Title.scss'

@translate()
@inject('accountStore')
@CSSModules(styles, {allowMultiple: true})
@observer
export default class Title extends React.Component {

  @observable count = 0

  componentWillReceiveProps(nextProps) {
    const {store: {resultsLoading, resultsCount}} = this.props
    this.count = !resultsLoading ? resultsCount : this.count  //...save previous for opacity loading effect
  }

  render() {
    const { mode, t, store, accountStore: { profile }, initial } = this.props
    const { resultsLoading, resultsCount } = store
    const title = mode == 'favorites' ? t('favorites.title') : t('results.title')
    const titleStyle = resultsLoading ? 'results_summery loading' : 'results_summery'
    return (
      <div className="row">
        <div className="large-12 columns">
          <h1 styleName={titleStyle}><span styleName="num">{this.count}</span> {title}
            {initial && <span style={{paddingRight: '8px'}}>{t('results.lastYear')}</span>}
            {!resultsLoading &&
              store.filters &&
              store.filters.length == 0
              && profile
              && profile.restricted
              &&
              <ExtraCount
                total={resultsCount}
              />
            }
          </h1>
        </div>

      </div>
    )
  }
}
