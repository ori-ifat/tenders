import React, {Component} from 'react'
import { array } from 'prop-types'
import CSSModules from 'react-css-modules'
import styles from './SearchInput.scss'
import {translate} from 'react-polyglot'
import {inject, observer} from 'mobx-react'
import Select from 'react-select'
import SubSearch from './SubSearch'
import SavedSearches from './SavedSearches'
import {observable, toJS} from 'mobx'
import forEach from 'lodash/forEach'
import remove from 'lodash/remove'
import {autocomplete} from 'common/services/apiService'
import enhanceWithClickOutside from 'react-click-outside'

const req = require.context('common/style/icons/', false)
const search_go = req('./search_go.svg')

@translate()
@inject('routingStore')
@inject('searchStore')
@inject('recordStore')
@enhanceWithClickOutside
@observer
@CSSModules(styles)
export default class SearchInput extends Component {
  static propTypes = {
    tags: array
  }

  @observable selectedValues =[]
  @observable showSaved = false

  componentWillMount() {
    const {searchStore, tags} = this.props
    if (tags) this.selectedValues = tags
    this.showSaved = false
    searchStore.loadSubSubjects()
  }

  componentWillReceiveProps(nextProps) {
    const {tags} = nextProps
    this.showSaved = false
    if (tags) this.selectedValues = tags
  }

  handleClickOutside() {
    //console.log('handleClickOutside')
    this.showSaved = false
  }

  onChange = values => {
    this.selectedValues = values
    setTimeout(() => {
      this.onSearch()
    }, 150)
  }

  getOptions = (input) => {
    input = input.trim()
    return autocomplete(input).then((result) => {
      //console.log('res', result)
      if (!result) {
        return
      }
      return { options: result }
    })
  }

  filterOptions = (options, filterString, values) => {
    if (!filterString) {
      return []
    }
    //that function will remove values that were already selected on previous action - to eliminate duplicates
    return options.filter(option => !values.find(value => value.ID + value.ResType + value.Name === option.ID + option.ResType + option.Name))
  }

  optionRenderer = (item) => {
    //can be used to override the options design
    let {ResType, Name} = item
    const {t} = this.props

    ResType = (ResType)
      ? t(`search.${ResType}`)
      : null

    return <div>
      <span>{Name}</span>
      <span className="type">{ResType}</span>
    </div>

  }

  onFocus = () => {
    if (this.selectedValues.length == 0) this.showSaved = true
  }
  /*
  onBlur = () => {
    this.showSaved = false
  }*/

  onInputKeyDown = (e) => {
    if(this.showSaved) this.showSaved = false
    if (e.keyCode === 13) {
      //ori s setTimeout to solve a bug, when search is committed before Select actually chose an item ...
      //e.preventDefault()  //fucks up the search.
      e.stopPropagation()
      setTimeout(() => {
        this.onSearch()
      }, 150) //to allow action to complete
    }
  }

  onSearch = () => {
    const { routingStore } = this.props
    const sort = 'publishDate'  //default sort. note, means that on every search action, sort will reset here
    /* remove the subSubjectName - to shorten url */
    //create a shallow copy of selectedValues - to avoid unneeded recursive operation upon change...
    const copied = this.selectedValues.slice()
    forEach(this.selectedValues, value => {
      //remove the current from the copied array
      remove(copied, val => val.UniqueID == value.UniqueID)
      //create a shallow copy of current tag - so original selectedValues will not change
      const tag = Object.assign({}, value)
      if (value.ResType == 'subsubject') {
        //remove the name property
        Reflect.deleteProperty(tag, 'Name')
      }
      else {
        //just encode
        //tag.Name = encodeURIComponent(tag.Name)
      }
      //add back to the copied array
      copied.push(tag)
    })
    //revert back to copied
    this.selectedValues = copied
    let payload = JSON.stringify(this.selectedValues)
    //minify the url:
    payload = payload.replace(/"ID"/g, '"I"').replace(/"Name"/g, '"N"').replace(/"ResType"/g, '"R"').replace(/"subsubject"/g, '"s"').replace(/"OrderBy"/g, '"O"').replace(/"UniqueID"/g, '"U"')
    //note: on new search, filters should be empty
    routingStore.push(`/results/${sort}/${encodeURIComponent(payload)}/[]`)
    //routingStore.push(`/results/${sort}/${payload}/[]`)   //without full encode, stange bug occurs on items with quotes on the name
  }

  onSearchClick = () => {
    const {searchStore, recordStore} = this.props
    const sort = 'publishDate'  //default sort - see above
    const tags = JSON.stringify(this.selectedValues)
    searchStore.applySort(sort)
    searchStore.applyTags(tags, false)
    searchStore.clearFilterLabels()
    searchStore.applyFilters('[]')
    recordStore.cleanChecked()
    //searchStore.clearResults()
    searchStore.fromRoute = true  //raise route flag - behave same as on route
    searchStore.initialDate = true //raise initial date flag - for last month label
    searchStore.loadNextResults()
    searchStore.loadNextFilters()
  }

  onClear = () => {
    const { routingStore } = this.props
    const sort = 'publishDate'  //default sort.
    routingStore.push(`/results/${sort}/[]/[]`)
  }

  render() {
    const selectedValues = toJS(this.selectedValues)
    const {searchStore, t} = this.props

    return (
      <div styleName="cont">
        <div className="row">
          <div className="medium-12 columns">
            <div id="searchbox_wrapper" styleName="wrapper">
              <a styleName="search_btn" onClick={this.onSearchClick}><img src={search_go} styleName="search-arrow" /></a>
              <Select.Async
                styleName="select-searchbox"
                className="search-select"
                name="searchbox"
                placeholder={t('search.placeHolder')}
                autoFocus={(this.selectedValues.length > 0)}
                noResultsText={null}
                searchPromptText=""
                multi={true}
                cache={false}
                clearable={false}
                loadOptions={this.getOptions}
                optionRenderer={this.optionRenderer}
                onChange={this.onChange}
                onFocus={this.onFocus}
                onInputKeyDown={this.onInputKeyDown}
                filterOptions={this.filterOptions}
                value={selectedValues}
                labelKey={'Name'}
                valueKey={'UniqueID'}
              />
              {this.showSaved &&
                <SavedSearches />
              }
            </div>
            <div styleName="reset_container">
              <div styleName="subsubjects">
                <SubSearch
                  items={searchStore.subSubjects}
                />
              </div>
              <div styleName="clear_s">
                <a onClick={this.onClear}>{t('search.cleanSearch')}</a>
              </div>
            </div>
          </div>
        </div>



    </div>

    )
  }
}
