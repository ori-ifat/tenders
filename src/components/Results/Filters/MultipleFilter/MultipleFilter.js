import React from 'react'
import { string, object, func } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import filter from 'lodash/filter'
import remove from 'lodash/remove'
import {doFilter} from 'common/utils/filter'
import CSSModules from 'react-css-modules'
import styles from './MultipleFilter.scss'

const req = require.context('common/style/icons/', false)
const editSrc = req('./icon_edit.svg')

@translate()
@inject('searchStore')
@CSSModules(styles)
@observer
export default class MultipleFilter extends React.Component {
  /* component for multiple values filter selection */
  //note: implemented for subsubjects and publishers only. need to find a more generic way to check the types
  //(such as item.SubSubjectName vs. item.PublisherName)

  static propTypes = {
    type: string,
    items: object,
    label: string,
    onClose: func
  }

  @observable open = false
  @observable type = ''
  @observable items = []
  @observable selected = []
  @observable itemLabels = []

  componentWillMount() {
    const {type, items} = this.props
    this.type = type
    this.items = items
  }

  componentWillReceiveProps(nextProps) {
    const {type, items} = nextProps
    this.type = type
    this.items = items
  }

  openModal = () => {
    this.open = true
  }

  closeModal = () => {
    this.open = false
  }

  doFilter = () => {
    //commit filters
    const { searchStore, onClose } = this.props
    const field = this.type == 'subsubjects' ? 'subsubject' : 'publisher'
    doFilter(searchStore, field, this.selected, this.itemLabels, onClose, this.closeModal)
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
    }
    //console.log(toJS(this.selected))
  }

  render() {
    const {t} = this.props
    const title = this.type == 'subsubjects' ? t('filter.subSubjectsTitle') : t('filter.publishersTitle')
    return(
      <div styleName="cb-wrapper">

        {this.open &&
          <div className="reveal-overlay" style={{display: 'block'}}>
            <div className="reveal tiny" style={{display: 'block'}}>
              <div>
                <h2>{title}</h2>
                <input type="text" onChange={this.filterItems} />
                <div style={{height: '300px', overflow: 'auto'}}>
                  {
                    this.items.map(((item, index) => {
                      const id = this.type == 'subsubjects' ? item.SubSubjectID : item.PublisherID
                      const name = this.type == 'subsubjects' ? item.SubSubjectName : item.PublisherName
                      return <div key={index}>
                        <input type="checkbox"
                          checked={this.selected.includes(id)}
                          name={name}
                          value={id}
                          onChange={this.onCheck}
                        />
                        <lable styleName="cb-label">{name}</lable>
                      </div>}), this
                    )
                  }
                </div>
                <div>
                  {
                    this.itemLabels.map((item, index) =>
                      <div key={index} styleName="selected-tile">{item}</div>
                    )
                  }
                </div>
                <div styleName="button-container">
                  <a styleName="button-cancel" onClick={this.closeModal}>{t('filter.cancel')}</a>
                  <a styleName="button-submit" onClick={this.doFilter}>{t('filter.choose')}</a>
                </div>
              </div>
            </div>
          </div>
        }
        <div onClick={this.openModal}>
          <h4>{title}
            <a><img src={editSrc} alt="" />{t('filter.edit')}</a>
          </h4>
          <span>{ this.props.label }</span>
          { (!this.props.label || this.props.label == '') &&
          <div>

            <span style={{cursor: 'pointer'}}>{title}</span>
          </div> }
        </div>

      </div>
    )
  }
}
