import React from 'react'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './NoData.scss'

@translate()
@CSSModules(styles)
export default class NoData extends React.Component {

  render() {
    const { t } = this.props

    return (
      <h1 styleName="no-data">{t('results.noData')} </h1>
    )
  }
}
