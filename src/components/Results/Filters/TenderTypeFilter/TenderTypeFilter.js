import React from 'react'
import { object } from 'prop-types'
import { /*inject,*/ observer } from 'mobx-react'
import {observable} from 'mobx'
import { translate } from 'react-polyglot'
//import filter from 'lodash/filter'
import remove from 'lodash/remove'
import find from 'lodash/find'
import {doFilter} from 'common/utils/filter'
import CSSModules from 'react-css-modules'
import styles from './TenderTypeFilter.scss'

@translate()
//@inject('searchStore')
@CSSModules(styles)
@observer
export default class TenderTypeFilter extends React.Component {

  static propTypes = {
    items: object,
    store: object
  }

  @observable items = []
  @observable selected = []
  searching = false

  componentWillMount() {
    const {items, store} = this.props
    this.items = items
    this.addSelected(store.filters)
  }

  componentWillReceiveProps(nextProps) {
    const {items, store} = nextProps
    this.items = items
    this.addSelected(store.filters)
  }

  addSelected = (filters) => {
    //get relevant tendertype filter (if any)
    const tenderTypes = find(filters, filter => {
      return filter.field == 'tendertype'
    })
    //iterate on items. add to selected the ones that were already filtered (or all, if none was) -
    //to check relevant on open\after filter action
    this.items && this.items.map(item => {
      if (!this.selected.includes(item.TenderTypeID) &&
        (tenderTypes == undefined || tenderTypes.values.includes(item.TenderTypeID))) {
        this.selected.push(item.TenderTypeID)
      }
    })
  }

  doFilter = () => {
    const { store } = this.props
    doFilter(store, 'tendertype', this.selected)
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
    //solve performance problem: raise search flag and setTimeout for filter commit action
    if (!this.searching) {
      this.searching = true
      setTimeout(() => {
        this.searching = false
        //commit:
        this.doFilter()
      }, 1000)
    }
  }

  render() {
    const {store, store: {resultsLoading}, t} = this.props
    const divStyle = resultsLoading && store.fromRoute ? 'loading' : ''
    return(
      <div styleName="tender_type">
        <h4>{t('filter.tenderTypeTitle')}</h4>
        {/*!store.resultsLoading &&*/
          <div styleName={divStyle} style={{paddingBottom: '20px'}}>
            {
              this.items.map(((item, index) =>
                <div className="checkbox" key={index}>
                  <input type="checkbox"
                    className="checkbox"
                    checked={this.selected.includes(item.TenderTypeID)}
                    name={item.TenderTypeName}
                    value={item.TenderTypeID}
                    onChange={this.onCheck}
                  />
                  <span styleName="cb-label">{item.TenderTypeName}</span>
                </div>), this
              )
            }
          </div>
        }
        {store.resultsLoading &&  //mask the checkboxes when loading - for opacity loader
          <div styleName="loading-mask">
            &nbsp;
          </div>
        }
      </div>
    )
  }
}
