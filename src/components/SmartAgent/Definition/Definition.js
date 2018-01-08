import React, {Component} from 'react'
import { object, func, bool } from 'prop-types'
import { inject, observer } from 'mobx-react'
import { observable, toJS } from 'mobx'
import { translate } from 'react-polyglot'
import Select from 'react-select'
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
    const {onError, onSave, query} = this.props
    if (this.selectedValues) {
      if (!this.selectedValues.SubSubjectID &&  this.words == '') {
        onError()
      }
      else {
        const newQuery = {
          SubsubjectID: this.selectedValues.SubSubjectID,
          SubSubjectName: this.selectedValues.SubSubjectName,
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
      <div>
        {this.edit ?
          <div>
            {!smartAgentStore.subSubjectsLoading && <Select
              styleName="subsubject-searchbox"
              className="search-select"
              name="searchbox"
              noResultsText={null}
              searchPromptText=""
              multi={false}
              cache={false}
              clearable={false}
              options={toJS(options)}
              onChange={this.onChange}
              onInputKeyDown={this.onInputKeyDown}
              value={this.selectedValues}
              labelKey={'SubSubjectName'}
              valueKey={'SubSubjectID'}
            />}
            <input type="text" name="words" styleName="word-input" defaultValue={this.words} onChange={this.updateField} />
            <a onClick={this.onCancel}>cancel</a>&nbsp;
            <a onClick={this.onSave}>save</a>
            {smartAgentStore.subSubjectsLoading && <div>Loading...</div>}
          </div>
          :
          isNew ?
            <a onClick={() => this.edit = true}>New</a>
            :
            <div className="grid-x">
              <div className="medium-3 cell">
                {query.SubSubjectName}
              </div>
              <div className="medium-6 cell">
                {query.SearchWords} <a onClick={this.onEdit}>edit</a>&nbsp;<a onClick={this.onDelete}>delete</a>
              </div>
            </div>
        }
      </div>
    )
  }
}
