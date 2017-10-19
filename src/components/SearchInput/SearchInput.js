import React, {Component} from 'react'
import { array } from 'prop-types'
import CSSModules from 'react-css-modules'
import styles from './SearchInput.scss'
import {translate} from 'react-polyglot'
import {inject, observer} from 'mobx-react'
import Select from 'react-select'
import {observable, toJS} from 'mobx'
import {autocomplete} from 'common/services/apiService'

@translate()
@inject('translationsStore')
@inject('routingStore')
@observer
@CSSModules(styles, { allowMultiple: true })
export default class SearchInput extends Component {
  static propTypes = {
    tags: array
  }

  @observable selectedValues =[]
  /*state = {
    selectedValues: []
  }*/

  componentWillMount() {
    const {tags} = this.props
    if (tags) this.selectedValues = tags
  }

  onChange = values => {
    //console.log(`Selected: ${JSON.stringify(values)}`)
    this.selectedValues = values
    //this.setState({selectedValues: values})
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

    let {ResType, Name} = item
    const {t} = this.props
    //note implementation needed for the 'partial' search
    const textWithApostrophes = ResType.indexOf('partial') > -1 ? t(`search.${ResType}_text`, { Name }) : Name // returns non translated type () if not found.

    ResType = (ResType)
      ? t(`search.${ResType}`)
      : null

    Name = (Name && !textWithApostrophes.includes(Name) && textWithApostrophes.includes(Name))
      ? textWithApostrophes
      : Name

    return <div className={item.disabled
      ? 'separate-line'
      : ''}>
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
    //const {selectedValues} = this.state
    const { routingStore } = this.props
    const sort = 'publishDate'  //default sort. note, means that on every search action, sort will reset here
    //const payload = JSON.stringify(selectedValues)
    const payload = JSON.stringify(this.selectedValues)
    routingStore.push(`/results/${sort}/${payload}`)
  }

  render() {
    const selectedValues = toJS(this.selectedValues)
    //const {selectedValues} = this.state
    const {t} = this.props

    return (
      <div styleName="row">
        <div styleName="medium-12 columns">
          <div id="searchbox_wrapper">
            <Select.Async
              styleName="select-searchbox"
              className="search-select"
              name="searchbox"
              placeholder={t('search.placeHolder')}
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
