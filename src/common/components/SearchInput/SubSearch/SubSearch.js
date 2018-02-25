import React from 'react'
import { string, object } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import filter from 'lodash/filter'
import find from 'lodash/find'
import remove from 'lodash/remove'
import take from 'lodash/take'
import {doFilter} from 'common/utils/filter'
import CSSModules from 'react-css-modules'
import styles from './SubSearch.scss'

const req = require.context('common/style/icons/', false)
const editSrc = req('./icon_edit.svg')

@translate()
@inject('searchStore')
@inject('routingStore')
@CSSModules(styles)
@observer
export default class SubSearch extends React.Component {
  /* component for multiple values filter selection */

  static propTypes = {
    items: object
  }

  @observable open = false
  @observable items = []
  @observable selected = []
  @observable itemLabels = []

  componentWillMount() {
    this.init(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps)
  }

  init = (props) => {
    const {items} = props
    this.items = items
    this.onCheckAll(false)
    this.checkSubsubjects()   //subsubject -> tag crap
    this.sortChecked(items)
  }

  sortChecked = (items) => {
    //place checked items on top:
    const checked = filter(items, item => {
      return this.selected.includes(item.SubSubjectID)
    }) //<- selected items
    const unchecked = filter(items, item => {
      return !this.selected.includes(item.SubSubjectID)
    })  //<- the rest
    //concat:
    this.items = [...checked, ...unchecked]
  }

  checkSubsubjects = () => {
    //check if store filters contain subsubject filter
    const {searchStore, t} = this.props
    //find it on current filters
    const tags = filter(searchStore.tags, tag => {
      return tag.ResType == 'subsubject'
    })
    if (tags.length > 0) {
      //iterate on values
      tags.map(tag => {
        if (!this.selected.includes(tag.ID)) {
          //add id if it is not there
          this.selected.push(tag.ID)
          //find relevant on items - for name label
          const found = find(this.items, item => {
            return item.SubSubjectID == tag.ID
          })
          if (found) {
            this.itemLabels.push(found.SubSubjectName)
            const labels = this.itemLabels.join(',')
            //update the 'selectedFilters' object on wrapper
            //onClose('subsubject', labels)
            //update current label - somehow it is not affected
            this.label = labels
          }
        }
      })
    }
  }

  openModal = () => {
    this.open = true
  }

  closeModal = () => {
    this.open = false
  }

  doFilter = () => {
    //commit filters
    const { searchStore, t } = this.props
    const field = 'subsubject'
    //subsubject -> tag crap
    //subsubjects: act like a search, not like a filter ...
    const tags = this.selected.map((item, index) => {
      return {ID: item, Name: encodeURIComponent(this.itemLabels[index]), ResType: field, UniqueID: parseFloat(`${item}.1`)}
    })
    //route list SearchInput, to enable a new search
    const { routingStore } = this.props
    const sort = 'publishDate'  //default sort. note, means that on every search action, sort will reset here
    remove(searchStore.tags, tag => {
      return tag.ResType === 'subsubject'
    })
    const newTags = [...searchStore.tags, ...tags]
    const payload = JSON.stringify(newTags)
    const filters = JSON.stringify([]) //...(searchStore.filters)
    routingStore.push(`/results/${sort}/${payload}/${filters}`)
    this.closeModal()
  }

  filterItems = e => {
    //filter the checkboxes by text field value
    const {items} = this.props
    const reduced = filter(items, item => {
      return item.SubSubjectName.indexOf(e.target.value) > -1
    }, this)
    this.items = reduced
  }

  onCheck = e => {
    //checkbox check\uncheck event
    if (e.target.checked) {
      if (!this.selected.includes(e.target.value)) {
        this.selected.push(parseInt(e.target.value))
        this.itemLabels.push(e.target.name)
      }
    }
    else {
      remove(this.selected, id => {
        return id === parseInt(e.target.value)
      })
      remove(this.itemLabels, name => {
        return name === e.target.name
      })
    }
    //console.log(toJS(this.selected))
  }

  onCheckAll = checked => {
    if (checked) {
      this.items.map((item => {
        const id = item.SubSubjectID
        const name = item.SubSubjectName
        if (!this.selected.includes(id)) {
          this.selected.push(id)
          this.itemLabels.push(name)
        }
      }), this)
    }
    else {
      this.selected.clear()
      this.itemLabels.clear()
    }
  }

  render() {
    const {t} = this.props
    const title = t('filter.subSubjectsTitle')
    const tileStyle = {}
    return(
      <div styleName="cb-wrapper">

        {this.open &&
          <div className="reveal-overlay"  style={{display: 'block'}}>
            <div className="reveal" styleName="multiple-selection" style={{display: 'block'}}>
              <div styleName="">
                <h2>{title}
                  <div styleName="selectAll_links">
                    <a onClick={() => this.onCheckAll(true)}>{t('filter.selectAll')}</a><span styleName="sep">|</span>
                    <a onClick={() => this.onCheckAll(false)}>{t('filter.clearAll')}</a>
                  </div>
                </h2>
                <input type="text" placeholder={t('filter.search')} onChange={this.filterItems} />
                <div>
                </div>
                <div style={{height: '300px', overflow: 'auto'}}>
                  {
                    this.items.map(((item, index) => {
                      const id = item.SubSubjectID
                      const name = item.SubSubjectName
                      return <div styleName="checkbox" key={index}>
                        <label styleName="cb-label">
                          <input type="checkbox"
                            styleName="checkbox"
                            checked={this.selected.includes(id)}
                            name={name}
                            value={id}
                            onChange={this.onCheck}
                          />
                          <span>{name}</span></label>
                      </div>}), this
                    )
                  }
                </div>
                <div styleName="selected">
                  {
                    take(this.itemLabels, 2).map((item, index) =>
                      <div key={index} styleName="selected-tile" style={tileStyle}>{item}</div>
                    )
                  }
                  {
                    this.itemLabels.length > 2 &&
                      <div styleName="selected-tile">{`${t('filter.more')} ${this.itemLabels.length - 2}`}</div>
                  }
                </div>
                <div styleName="button-container">
                  <a  styleName="button-cancel" onClick={this.closeModal}>{t('filter.cancel')}</a>
                  <a className="button" styleName="button-submit" onClick={this.doFilter}>{t('filter.choose')}</a>
                </div>
              </div>
            </div>
          </div>
        }
        <div>
          <a onClick={this.openModal}>{title}</a>
        </div>

      </div>
    )
  }
}
