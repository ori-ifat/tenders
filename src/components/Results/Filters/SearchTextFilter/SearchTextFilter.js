import React from 'react'
import { string } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import filter from 'lodash/filter'
import remove from 'lodash/remove'
import find from 'lodash/find'
import {doFilter} from 'common/utils/filter'
import CSSModules from 'react-css-modules'
import styles from './SearchTextFilter.scss'

@translate()
@inject('searchStore')
@CSSModules(styles)
@observer
export default class SearchTextFilter extends React.Component {

  static propTypes = {
    text: string
  }

  @observable text = ''

  componentWillMount() {
    const {text} = this.props
    this.text = text
  }

  componentWillReceiveProps(nextProps) {
    const {text} = nextProps
    this.text = text
  }

  doFilter = () => {
    const { searchStore } = this.props
    doFilter(searchStore, 'searchtext', [this.text])
  }

  onChange = e => {
    this.text = e.target.value
    //console.log(toJS(this.selected))
    //this.doFilter()  //too slow
  }

  onKeyDown = e => {
    if (e.keyCode === 13) {
      setTimeout(() => {
        this.doFilter()
      }, 150) //to allow action to complete
    }
  }

  render() {
    const {t} = this.props
    return(
      <div styleName="free_search">
        <h4>{t('filter.searchText')}</h4>
        <input type="text"
          placeholder={t('filter.search')}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown} />
      </div>
    )
  }
}
