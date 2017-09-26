import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './SearchInput.scss'
import {translate} from 'react-polyglot'
import {inject, observer} from 'mobx-react'
import Select from 'react-select'
import {observable, toJS} from 'mobx'
import {autocomplete} from 'common/services/apiService'

const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' }
]

@translate()
@inject('translationsStore')
//@inject('routingStore')
//@observer
@CSSModules(styles, { allowMultiple: true })
export default class SearchInput extends Component {

  //@observable selectedValues
  state = {
    selectedValues: []
  }

  componentWillMount = () => {
    console.log('searchinput component')
    //this.loadResults(this.props)
  }

  onChange = values => {
    //console.log(`Selected: ${JSON.stringify(values)}`)
    //this.selectedValues = values
    this.setState({selectedValues: values})
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
      setTimeout(() => {
        this.onSearch()
      }, 150) //to allow action to complete
    }
  }

  onSearch = () => {
    console.log('search committed', this.state.selectedValues)
  }

  render() {
    //const selectedValues = toJS(this.selectedValues)
    const {selectedValues} = this.state
    //console.log(selectedValues)
    const {t} = this.props
    /*
    <Select
      name="searchbox"
      multi={true}
      cache={false}
      clearable={false}
      options={options}
      onChange={this.onChange}
      value={selectedValues}
    />
    <Select.Async
      name="searchbox"
      multi={true}
      cache={false}
      clearable={false}
      loadOptions={this.getOptions}
      onChange={this.onChange}
      value={selectedValues}
      labelKey={'Name'}
      valueKey={'ID'}
    />
    */
    return (
      <form>
        <div styleName="row">
          <div styleName="medium-12 columns">
            <div id="searchbox_wrapper">
              {/*<input type="text" id="searchbox" placeholder={t('search.placeHolder')} />*/}
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
      </form>
    )
  }
}
