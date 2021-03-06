import React from 'react'
import { string, object } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import filter from 'lodash/filter'
import find from 'lodash/find'
import remove from 'lodash/remove'
//import forEach from 'lodash/forEach'
import take from 'lodash/take'
import {doFilter} from 'common/utils/filter'
import CSSModules from 'react-css-modules'
import styles from './MultipleFilter.scss'

const req = require.context('common/style/icons/', false)
const editSrc = req('./icon_edit.svg')

@translate()
@inject('searchStore')
@inject('routingStore')
@CSSModules(styles)
@observer
export default class MultipleFilter extends React.Component {
  /* component for multiple values filter selection */
  //note: implemented for subsubjects and publishers only. need to find a more generic way to check the types
  //(such as item.SubSubjectName vs. item.PublisherName)

  static propTypes = {
    type: string,
    items: object,
    label: string
  }

  @observable open = false
  @observable type = ''
  @observable items = []
  @observable selected = []
  @observable itemLabels = []
  //@observable allChecked = false
  @observable label = ''

  componentWillMount() {
    this.init(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps)
  }

  init = (props) => {
    const {type, items, label} = props
    this.type = type
    this.label = label
    this.items = items || []  //init for checkSubsubjects()...
    //this.checkSubsubjects()   //subsubject -> tag crap
    this.sortChecked(items)
  }

  sortChecked = (items) => {
    //place checked items on top:
    const checked = filter(items, item => {
      return this.type == 'subsubjects' ?
        this.selected.includes(item.SubSubjectID) :
        this.selected.includes(item.PublisherID)
    }) //<- selected items
    const unchecked = filter(items, item => {
      return this.type == 'subsubjects' ?
        !this.selected.includes(item.SubSubjectID) :
        !this.selected.includes(item.PublisherID)
    })  //<- the rest
    //concat:
    this.items = [...checked, ...unchecked]
  }

  checkSubsubjects = () => {
    //check if store filters contain subsubject filter
    if (this.type == 'subsubjects') {
      const {searchStore, t} = this.props
      //find it on current filters
      const filter = find(searchStore.filters, item => {
        return item.field == 'subsubject'
      })
      if (filter) {
        //iterate on values
        filter.values.map(id => {
          if (!this.selected.includes(id)) {
            //add id if it is not there
            this.selected.push(id)
            //find relevant on items - for name label
            const found = find(this.items, item => {
              return item.SubSubjectID == id
            })
            if (found) {
              this.itemLabels.push(found.SubSubjectName)
              const labels = this.itemLabels.join(',')
              //update the 'selectedFilters' object on wrapper
              //onClose('subsubject', labels)
              searchStore.setSelectedFilters('subsubject', labels, t('filter.more'))
              //update current label - somehow it is not affected
              this.label = labels
            }
          }
        })
      }
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
    const field = this.type == 'subsubjects' ? 'subsubject' : 'publisher'
    /* if (this.type == 'subsubjects') {  //subsubject -> tag crap
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
    }
    else { */
      //normal filter behavior
      doFilter(searchStore, field, this.selected, this.itemLabels, true, this.closeModal, t('filter.more'))
    //}
  }

  filterItems = e => {
    //filter the checkboxes by text field value
    const {items} = this.props
    const reduced = filter(items, item => {
      if (this.type == 'subsubjects') {
        return item.SubSubjectName.indexOf(e.target.value) > -1
      }
      else {
        return item.PublisherName.indexOf(e.target.value) > -1
      }
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
      //this.allChecked = false
    }
    //console.log(toJS(this.selected))
  }

  onCheckAll = checked => {
    if (checked) {
      this.items.map((item => {
        const id = this.type == 'subsubjects' ? item.SubSubjectID : item.PublisherID
        const name = this.type == 'subsubjects' ? item.SubSubjectName : item.PublisherName
        if (!this.selected.includes(id)) {
          this.selected.push(id)
          this.itemLabels.push(name)
        }
      }), this)
      //this.allChecked = true
    }
    else {
      this.selected.clear()
      this.itemLabels.clear()
      //this.allChecked = false
    }
  }

  render() {
    const {t} = this.props
    const title = this.type == 'subsubjects' ? t('filter.subSubjectsTitle') : t('filter.publishersTitle')
    const tileStyle = this.type != 'subsubjects' ? {marginBottom: '3px'} : {}
    return(
      <div styleName="cb-wrapper">

        {this.open &&
          <div className="reveal-overlay"  style={{display: 'block'}}>
            <div className="reveal" styleName="multiple-selection" style={{display: 'block'}}>
              <div styleName="">
                <h2>{title}
                  {this.type == 'subsubjects' &&
                    <div styleName="selectAll_links">
                      <a onClick={() => this.onCheckAll(true)}>{t('filter.selectAll')}</a><span styleName="sep">|</span>
                      <a onClick={() => this.onCheckAll(false)}>{t('filter.clearAll')}</a>
                    </div>
                  }
                </h2>
                <input type="text" placeholder={t('filter.search')} onChange={this.filterItems} />
                {this.type == 'subsubjects' && <div>


                </div>}
                <div style={{height: '300px', overflow: 'auto'}}>
                  {
                    this.items && this.items.map(((item, index) => {
                      const id = this.type == 'subsubjects' ? item.SubSubjectID : item.PublisherID
                      const name = this.type == 'subsubjects' ? item.SubSubjectName : item.PublisherName
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
                    this.itemLabels && take(this.itemLabels, 2).map((item, index) =>
                      <div key={index} styleName="selected-tile" style={tileStyle}>{item}</div>
                    )
                  }
                  {
                    this.itemLabels && this.itemLabels.length > 2 &&
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
        <div onClick={this.openModal}>
          <h4>{title}
            <a><img src={editSrc} alt="" />{t('filter.edit')}</a>
          </h4>
          <span>{ this.label }</span>
          { (!this.label || this.label == '') &&
          <div>

            <span style={{cursor: 'pointer'}}>{title}</span>
          </div> }
        </div>

      </div>
    )
  }
}
