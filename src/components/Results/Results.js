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
import {addToFavorites, clearCache} from 'common/services/apiService'
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
  @observable subsubjects = ''

  componentWillMount() {
    //console.log('mount')
  }

  componentWillReceiveProps(nextProps, nextState) {
    //console.log('receive props')
    this.checkedItems = []
  }

  onCheck = (checked, value, isFavorite) => {
    //console.log('onCheck', checked, value, isFavorite)
    setCheckedStatus(this.checkedItems, checked, value, isFavorite)
    //console.log(this.checkedItems)
  }

  onFav = (tenderID, add) => {
    //console.log('onFav', tenderID, add)
    //call api with item and relevant action (add\!add)
    const action = add ? 'Favorite_add' : 'Favorite_del'
    addToFavorites(action, [tenderID])
    clearCache()
    setFavStatus(this.checkedItems, tenderID, add)
    //console.log(this.checkedItems)
  }

  hideToolbar = () => {
    this.checkedItems = []
  }

  viewDetails = (tenderID) => {
    //this.setState({selected: true})
    //const { item: { TenderID } } = this.props
    console.log('TenderID', tenderID)
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

  setFilterLabel = (label, value) => {
    switch (label) {
    case 'subsubjects':
      this.subsubjects = value
      break
    }
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
                  setLabel={this.setFilterLabel}
                  subsubjects={this.subsubjects}
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
                onCancel={this.cancelReminder}
                title={this.reminderTitle}
                date={this.reminderInfoDate}
                reminderID={this.reminderID}
              />
            }
          </div>
        }
      </div>
    )
  }
}
