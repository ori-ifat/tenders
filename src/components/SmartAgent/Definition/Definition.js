import React, {Component} from 'react'
import { array, object, func, bool } from 'prop-types'
import { inject, observer } from 'mobx-react'
import { observable, toJS } from 'mobx'
import { translate } from 'react-polyglot'
import find from 'lodash/find'
import Select from 'react-select'
import Loading from 'common/components/Loading/Loading'
import CSSModules from 'react-css-modules'
import styles from './Definition.scss'

@translate()
@inject('smartAgentStore')
@observer
@CSSModules(styles)
export default class Definition extends Component {

  static propTypes = {
    isNew: bool,
    query: object,
    allQueries: array,
    onError: func,
    onSave: func,
    onDelete: func
  }

  @observable selectedValues = null
  @observable words = ''
  @observable edit = false

  componentWillMount() {
    this.initComponent(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.initComponent(nextProps)
  }

  initComponent = (props) => {
    const {isNew} = props
    if (!isNew) {
      const {query: {SubsubjectID, SubSubjectName, SearchWords}} = props
      //initialize the <Select> with the selected value:
      const query = {
        SubSubjectID: SubsubjectID,
        SubSubjectName
      }
      this.selectedValues = query
      //set the words
      this.words = SearchWords
    }
  }

  updateField = e => {
    this.words = e.target.value
  }

  onChange = values => {
    this.selectedValues = values
  }

  onInputKeyDown = (e) => {
    if (e.keyCode === 13) {
      //e.preventDefault()  //fucks up the search.
      e.stopPropagation()
    }
  }

  onEdit = () => {
    this.edit = true
  }

  onSave = () => {
    const {isNew, onError, onSave, query, allQueries} = this.props
    if (this.selectedValues || (this.selectedValues == null && this.words != '')) {
      const found = find(allQueries, current => {
        return this.selectedValues && current.SubsubjectID == this.selectedValues.SubSubjectID
      })
      if (found && isNew) {
        onError(true)
      }
      else {
        const subSubjectID = this.selectedValues != null ? this.selectedValues.SubSubjectID : null
        const subSubjectName = this.selectedValues != null ? this.selectedValues.SubSubjectName : null
        const newQuery = {
          SubsubjectID: subSubjectID,
          SubSubjectName: subSubjectName,
          SearchWords: this.words || ''
        }
        onSave(query, newQuery)
        this.edit = false
      }
    }
    else {
      onError()
    }
  }

  onCancel = () => {
    this.edit = false
  }

  onDelete = () => {
    const {onDelete, query} = this.props
    onDelete(query)
  }

  render() {
    //const selectedValues = toJS(this.selectedValues)  //for multiple option - an array
    const {smartAgentStore, query, isNew, t} = this.props
    const options = smartAgentStore.subSubjects
    return (
      <div styleName="line" >
        {this.edit ?
          <div className="grid-x">

            {!smartAgentStore.subSubjectsLoading &&
              <div styleName="fields" className="medium-3 cell">
                <Select
                  styleName="branch"
                  className="search-select"
                  name="searchbox"
                  placeholder={t('agent.placeHolder')}
                  noResultsText={null}
                  searchPromptText=""
                  rtl={true}
                  multi={false}
                  cache={false}
                  clearable={false}
                  options={toJS(options)}
                  onChange={this.onChange}
                  onInputKeyDown={this.onInputKeyDown}
                  value={this.selectedValues}
                  labelKey={'SubSubjectName'}
                  valueKey={'SubSubjectID'}
                />
              </div>
            }
            <div styleName="fields" className="medium-7 cell">
              <input type="text" name="words" styleName="word-input" defaultValue={this.words} onChange={this.updateField} />
            </div>
            <div styleName="links" className="medium-2 cell">
              <a onClick={this.onCancel}>{t('agent.cancel')}</a>&nbsp;
              <a onClick={this.onSave}>{t('agent.save')}</a>
            </div>

            {smartAgentStore.subSubjectsLoading && <Loading />}
          </div>
          :
          isNew ?
            <a styleName="add" onClick={() => this.edit = true}>{t('agent.add')}</a>
            :
            <div className="grid-x">
              <div styleName="fields" className="medium-3 cell">
                <span>{query.SubSubjectName}</span>
              </div>
              <div styleName="fields" className="medium-7 cell">
                {query.SearchWords}
              </div>
              <div styleName="links" className="medium-2 cell">
                <a onClick={this.onEdit}>{t('agent.edit')}</a>
                <a onClick={this.onDelete}>{t('agent.delete')}</a>
              </div>

            </div>
        }
      </div>
    )
  }
}
