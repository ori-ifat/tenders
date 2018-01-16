import React, {Component} from 'react'
import { array } from 'prop-types'
import CSSModules from 'react-css-modules'
import styles from './SearchInput.scss'
import {translate} from 'react-polyglot'
import {inject, observer} from 'mobx-react'
import Select from 'react-select'
import {observable, toJS} from 'mobx'
import {autocomplete} from 'common/services/apiService'

const req = require.context('common/style/icons/', false)
const search_go = req('./search_go.svg')

@translate()
@inject('routingStore')
@inject('searchStore')
@inject('recordStore')
@observer
@CSSModules(styles)
export default class SearchInput extends Component {
  static propTypes = {
    tags: array
  }

  @observable selectedValues =[]

  componentWillMount() {
    const {tags} = this.props
    if (tags) this.selectedValues = tags
  }

  componentWillReceiveProps(nextProps) {
    const {tags} = nextProps
    if (tags) this.selectedValues = tags
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
      if (!result) {
        return
      }
      return { options: result }
    })
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

  onInputKeyDown = (e) => {
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
    const payload = JSON.stringify(this.selectedValues)
    //note: on new search, filters should be empty
    routingStore.push(`/results/${sort}/${payload}/[]`)
  }

  onSearchClick = () => {
    const {searchStore, recordStore} = this.props
    const sort = 'publishDate'  //default sort - see above
    const tags = JSON.stringify(this.selectedValues)
    searchStore.applySort(sort)
    searchStore.applyTags(tags)
    searchStore.clearFilterLabels()
    searchStore.applyFilters('[]')
    recordStore.cleanChecked()
    //searchStore.clearResults()
    searchStore.fromRoute = true  //raise route flag - behave same as on route
    searchStore.initialDate = true //raise initial date flag - for last month label
    searchStore.loadNextResults()
    searchStore.loadNextFilters()
  }

  render() {
    const selectedValues = toJS(this.selectedValues)
    const {t} = this.props

    return (
      <div className="row">
        <div className="medium-12 columns">
          <div id="searchbox_wrapper" styleName="wrapper">
            <a styleName="search_btn" onClick={this.onSearchClick}><img src={search_go}/></a>
            <Select.Async
              styleName="select-searchbox"
              className="search-select"
              name="searchbox"
              placeholder={t('search.placeHolder')}
              autoFocus
              noResultsText={null}
              searchPromptText=""
              multi={true}
              cache={false}
              clearable={false}
              loadOptions={this.getOptions}
              optionRenderer={this.optionRenderer}
              onChange={this.onChange}
              onInputKeyDown={this.onInputKeyDown}
              value={selectedValues}
              labelKey={'Name'}
              valueKey={'ID'}
            />
          </div>
        </div>
      </div>
    )
  }
}
