import React from 'react'
import { number } from 'prop-types'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import { translate } from 'react-polyglot'
import { getExtraCount } from 'common/services/apiService'
import CSSModules from 'react-css-modules'
import styles from './ExtraCount.scss'

@translate()
@inject('searchStore')
@CSSModules(styles, {allowMultiple: true})
@observer
export default class ExtraCount extends React.Component {

  static propTypes = {
    total: number
  }

  @observable extraCount = 0
  @observable loading = false

  componentWillMount() {
    const { searchStore } = this.props
    this.loading = true
    getExtraCount(searchStore.serializedTags).then(res => {
      this.extraCount = res
      this.loading = false
    })
  }

  render() {
    const { total, t } = this.props
    const count = this.extraCount
    //if extraCount equals to the total results count, hide the div
    const style = count == total || this.loading ? 'extra-div hide' : 'extra-div'
    return (
      <div styleName={style}>
        {t('results.extraData', {count})}
      </div>
    )
  }
}