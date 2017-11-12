import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import { searchStore } from 'stores'
import SearchInput from 'common/components/SearchInput'
import ResultsTitle from './ResultsTitle'
import ResultsActions from './ResultsActions'
import ResultsList from './ResultsList'
import Filters from './Filters'
import Banners from './Banners'
import Toolbar from 'common/components/Toolbar'
import ResultsItemDetails from 'common/components/ResultsItemDetails'
import Reminder from 'common/components/Reminder'
import NoData from 'components/NoData'
import {setCheckedStatus, setFavStatus, getImageUrl} from 'common/utils/util'
import ImageView from 'common/components/ImageView'
import CSSModules from 'react-css-modules'
import styles from './results.scss'

@withRouter
@whenRouted(({ params: { sort, tags, filters } }) => {
  searchStore.applySort(sort)
  searchStore.applyTags(tags)
  searchStore.applyFilters(filters)
  searchStore.clearResults()
  searchStore.loadNextResults()
})
@inject('searchStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class Results extends Component {

  @observable checkedItems = []
  @observable selectedTender = -1
  @observable showImage = false
  @observable imageUrl = ''
  @observable imageTitle = ''
  @observable reminderItem = -1
  @observable reminderTitle = ''
  @observable reminderInfoDate = null
  @observable reminderID = -1;
  //@observable subsubjects = ''
  @observable selectedFilters = {}

  componentWillMount() {
    //console.log('mount')
  }

  componentWillReceiveProps(nextProps, nextState) {
    //console.log('receive props')
    this.checkedItems = []
  }

  onCheck = (checked, value, isFavorite) => {
    setCheckedStatus(this.checkedItems, checked, value, isFavorite)
  }

  onFav = (tenderID, add) => {
    setFavStatus(this.checkedItems, tenderID, add)
  }

  hideToolbar = () => {
    this.checkedItems = []
  }

  viewDetails = (tenderID) => {
    this.selectedTender = tenderID
  }

  closeDetails = () => {
    this.selectedTender = -1
  }

  showViewer = (fileName, title) => {
    const url = getImageUrl(fileName)
    this.imageUrl = url
    this.imageTitle = title
    this.showImage = true
    document.body.style.overflowY = 'hidden'
  }

  closeViewer = () => {
    this.showImage = false
    document.body.style.overflowY = 'visible'
  }

  setReminder = (tenderID, title, infoDate, reminderID) => {
    this.reminderItem = tenderID
    this.reminderTitle = title
    this.reminderInfoDate = infoDate
    this.reminderID = reminderID
  }

  cancelReminder = () => {
    this.reminderItem = -1
    this.reminderTitle = ''
    this.reminderInfoDate = null
    this.reminderID = -1
  }

  setSelectedFilters = (label, value) => {
    /* set the selectedFilters object - a state-like object for the filter container.
      need that because the entire object is recreated upon filter commit action */
    switch (label) {
    //note: Reflect.deleteProperty() may not work in IE...
    case 'subsubject':
      delete this.selectedFilters.subsubjects
      this.selectedFilters.subsubjects = value
      break
    case 'publisher':
      delete this.selectedFilters.publishers
      this.selectedFilters.publishers = value
      break
    case 'dateField':
      delete this.selectedFilters.dateField
      this.selectedFilters.dateField = value
    case 'publishdate':
    case 'infodate':
      delete this.selectedFilters.date
      this.selectedFilters.date = { [label]: value}
      break
    }
    //console.log(this.selectedFilters)
  }

  render() {

    const {searchStore, searchStore: {resultsLoading, resultsCount, tags}} = this.props
    return (
      <div style={{marginTop: '50px'}}>
        <SearchInput tags={toJS(tags)} />
        {resultsLoading && <div>Loading...</div>}
        {resultsCount == 0 && !resultsLoading && <NoData />}
        {resultsCount > 0 &&
          <div>
            <ResultsTitle />
            <div className="row">
              <div className="columns large-3">
                <hr />
                <Filters
                  setSelected={this.setSelectedFilters}
                  selectedFilters={this.selectedFilters}
                />
                <Banners />
              </div>
              <div className="columns large-9">
                <hr />
                <ResultsActions />
                <ResultsList
                  store={searchStore}
                  loadMore={searchStore.loadNextResults}
                  onCheck={this.onCheck}
                  onFav={this.onFav}
                  viewDetails={this.viewDetails}
                  setReminder={this.setReminder}
                  checkedItems={this.checkedItems} />
              </div>
            </div>
            <Toolbar
              checkedItems={this.checkedItems}
              onClose={this.hideToolbar}
            />
            {this.selectedTender > -1 && !this.showImage &&
              <ResultsItemDetails
                itemID={this.selectedTender}
                onClose={this.closeDetails}
                showViewer={this.showViewer}
              />}
            {this.selectedTender > -1 && this.showImage &&
              <ImageView
                onClose={this.closeViewer}
                url={this.imageUrl}
                title={this.imageTitle}
              />
            }
            {this.reminderItem > -1 &&
              <Reminder
                tenderID={this.reminderItem}
                onClose={this.cancelReminder}
                title={this.reminderTitle}
                infoDate={this.reminderInfoDate}
                reminderID={this.reminderID}
              />
            }
          </div>
        }
      </div>
    )
  }
}
