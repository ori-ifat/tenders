import React from 'react'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import filter from 'lodash/filter'
import remove from 'lodash/remove'
import {doFilter} from 'common/utils/filter'
import CSSModules from 'react-css-modules'
import styles from './TenderTypeFilter.scss'

@translate()
@inject('searchStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class TenderTypeFilter extends React.Component {
  @observable items = []
  @observable selected = []

  componentWillMount() {
    const {items} = this.props
    this.items = items
  }

  componentWillReceiveProps(nextProps) {
    const {items} = nextProps
    this.items = items
  }

  doFilter = () => {
    const { searchStore } = this.props
    doFilter(searchStore, 'tendertype', this.selected)  
  }

  onCheck = e => {
    if (e.target.checked) {
      if (!this.selected.includes(e.target.value)) {
        this.selected.push(parseInt(e.target.value))
      }
    }
    else {
      remove(this.selected, id => {
        return id === parseInt(e.target.value)
      })
    }
    //console.log(toJS(this.selected))
  }

  render() {
    const {t} = this.props
    return(
      <div>
        <div>{t('filter.tenderTypeTitle')}</div>
        {
          this.items.map(((item, index) =>
            <div key={index}>
              <input type="checkbox"
                checked={this.selected.includes(item.TenderTypeID)}
                name={item.TenderTypeName}
                value={item.TenderTypeID}
                onChange={this.onCheck}
              />
              <span styleName="cb-label">{item.TenderTypeName}</span>
            </div>), this
          )
        }
        <a onClick={this.doFilter}>Commit</a>
      </div>
    )
  }
}
