import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import { favoritesStore } from 'stores'
import SearchInput from 'common/components/SearchInput'
import ResultsTitle from 'components/Results/ResultsTitle'
import ResultsActions from 'components/Results/ResultsActions'
import ResultsList from 'components/Results/ResultsList'
import Toolbar from 'common/components/Toolbar'
import ResultsItemDetails from 'common/components/ResultsItemDetails'
import Reminder from 'common/components/Reminder'
import NoData from 'components/NoData'
import NotLogged from 'common/components/NotLogged'
import {setCheckedStatus, setFavStatus, getImageUrl} from 'common/utils/util'
import ImageView from 'common/components/ImageView'
import CSSModules from 'react-css-modules'
import styles from './favorites.scss'

@withRouter
@whenRouted(({ params: { sort, tags, filters } }) => {
  favoritesStore.clearResults()
  favoritesStore.loadNextResults()
})
@inject('favoritesStore')
@inject('accountStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class Favorites extends Component {

  @observable checkedItems = []
  @observable selectedTender = -1
  @observable showImage = false
  @observable imageUrl = ''
  @observable imageTitle = ''
  @observable reminderItem = -1
  @observable reminderTitle = ''
  @observable reminderInfoDate = null
  @observable reminderID = -1;
  @observable showLoginMsg = false
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
    const {accountStore} = this.props
    if (accountStore.profile) {
      setFavStatus(this.checkedItems, tenderID, add)
    }
    else {
      this.showLoginMsg = true
    }
  }

  hideToolbar = () => {
    this.checkedItems = []
  }

  viewDetails = (tenderID) => {
    const {accountStore} = this.props
    if (accountStore.profile) {
      this.selectedTender = tenderID
    }
    else {
      this.showLoginMsg = true
    }
  }

  closeDetails = () => {
    this.selectedTender = -1
  }

  showViewer = (fileName, title) => {
    const {accountStore} = this.props
    if (accountStore.profile) {
      const url = getImageUrl(fileName)
      this.imageUrl = url
      this.imageTitle = title
      this.showImage = true
      document.body.style.overflowY = 'hidden'
    }
  }

  closeViewer = () => {
    this.showImage = false
    document.body.style.overflowY = 'visible'
  }

  setReminder = (tenderID, title, infoDate, reminderID) => {
    const {accountStore} = this.props
    if (accountStore.profile) {
      this.reminderItem = tenderID
      this.reminderTitle = title
      this.reminderInfoDate = infoDate
      this.reminderID = reminderID
    }
    else {
      this.showLoginMsg = true
    }
  }

  cancelReminder = () => {
    this.reminderItem = -1
    this.reminderTitle = ''
    this.reminderInfoDate = null
    this.reminderID = -1
  }

  notlogged = () => {
    this.showLoginMsg = true
  }

  continueUnlogged = () => {
    this.showLoginMsg = false
  }

  render() {

    const {accountStore, favoritesStore, favoritesStore: {resultsLoading, resultsCount, tags}} = this.props
    return (
      <div style={{marginTop: '50px'}}>
        <SearchInput tags={toJS(tags)} />
        {resultsLoading && <div>Loading...</div>}
        {resultsCount == 0 && !resultsLoading && <NoData error={favoritesStore.searchError} />}
        {resultsCount > 0 &&
          <div>
            <ResultsTitle />
            <div className="row">
              <div className="columns large-12">
                <hr />
                <ResultsActions />
                <ResultsList
                  store={favoritesStore}
                  loadMore={favoritesStore.loadNextResults}
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
              notlogged={this.notlogged}
            />
            {this.selectedTender > -1 && !this.showImage && accountStore.profile &&
              <ResultsItemDetails
                itemID={this.selectedTender}
                onClose={this.closeDetails}
                showViewer={this.showViewer}
              />}
            {this.selectedTender > -1 && this.showImage && accountStore.profile &&
              <ImageView
                onClose={this.closeViewer}
                url={this.imageUrl}
                title={this.imageTitle}
              />
            }
            {this.reminderItem > -1 && accountStore.profile &&
              <Reminder
                tenderID={this.reminderItem}
                onClose={this.cancelReminder}
                title={this.reminderTitle}
                infoDate={this.reminderInfoDate}
                reminderID={this.reminderID}
              />
            }
            {this.showLoginMsg &&
              <NotLogged
                onCancel={this.continueUnlogged}
              />
            }
          </div>
        }
      </div>
    )
  }
}
