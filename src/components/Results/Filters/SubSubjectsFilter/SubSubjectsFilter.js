import React from 'react'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import filter from 'lodash/filter'
import remove from 'lodash/remove'
import {doFilter} from 'common/utils/filter'
import CSSModules from 'react-css-modules'
import styles from './SubSubjectsFilter.scss'

@translate()
@inject('searchStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class SubSubjectsFilter extends React.Component {

  @observable open = false
  @observable items = []
  @observable selected = []
  @observable itemLabels = []

  componentWillMount() {
    const {items} = this.props
    this.items = items
  }

  componentWillReceiveProps(nextProps) {
    const {items} = nextProps
    this.items = items
  }

  openModal = () => {
    this.open = true
  }

  closeModal = () => {
    this.open = false
  }

  doFilter = () => {
    const { searchStore, onClose } = this.props
    doFilter(searchStore, 'subsubject', this.selected, this.itemLabels, onClose, this.open)
  }

  filterItems = e => {
    const {items} = this.props
    const reduced = filter(items, item => {
      return item.SubSubjectName.indexOf(e.target.value) > -1
    })
    this.items = reduced
  }

  onCheck = e => {
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
    return(
      <div>
        {this.open ?
          <div className="reveal-overlay" style={{display: 'block'}}>
            <div className="reveal tiny" style={{display: 'block'}}>
              <div>
                <h2>{t('filter.subSubjectsTitle')}</h2>
                <input type="text" onChange={this.filterItems} />
                <div style={{height: '300px', overflow: 'auto'}}>
                  {
                    this.items.map(((item, index) =>
                      <div key={index}>
                        <input type="checkbox"
                          checked={this.selected.includes(item.SubSubjectID)}
                          name={item.SubSubjectName}
                          value={item.SubSubjectID}
                          onChange={this.onCheck}
                        />
                        <span styleName="cb-label">{item.SubSubjectName}</span>
                      </div>), this
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
          </div> :
          <div onClick={this.openModal}>
            { this.props.label }
            <br />
            <span style={{cursor: 'pointer'}}>{t('filter.subSubjectsTitle')}</span>
          </div>
        }
      </div>
    )
  }
}
