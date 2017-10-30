import React, {Component} from 'react'
import SearchInput from 'components/SearchInput'
import Test from 'components/Test'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import { homeStore } from 'stores'
import { translate } from 'react-polyglot'
import HomeTitle from './HomeTitle'
import HomeList from './HomeList'
import Toolbar from 'common/components/Toolbar'
import ResultsItemDetails from 'common/components/ResultsItemDetails'
import {setCheckedStatus, setFavStatus, getImageUrl} from 'common/utils/util'
import {addToFavorites, clearCache} from 'common/services/apiService'
import ImageView from 'common/components/ImageView'
import CSSModules from 'react-css-modules'
import styles from './home.scss'

@translate()
@withRouter
@whenRouted(() => {
  homeStore.loadAgentResults()
  homeStore.getBanner()
  homeStore.loadMoreTenders()
})
@inject('homeStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class Home extends Component {

  @observable checkedItems = []
  @observable selectedTender = -1
  @observable showImage = false
  @observable imageUrl = ''
  @observable imageTitle = ''

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

  render() {
    const { homeStore, t } = this.props

    return (
      <div>
        <div className="row">
          <div className="column large-12">
            <div styleName="search-div" >
              <SearchInput />
              {<HomeTitle />}
              <HomeList
                items={homeStore.results}
                onCheck={this.onCheck}
                onFav={this.onFav}
                viewDetails={this.viewDetails}
                checkedItems={this.checkedItems}
              />
              <Banner banner={toJS(homeStore.banner)} />
              <h6 styleName="more-tenders-title">{t('home.moreTenders')}</h6>
              <HomeList
                items={homeStore.resultsMore}
                viewDetails={this.viewDetails}
                onFav={this.onFav}
              />
            </div>
          </div>
        </div>
        <Toolbar checkedItems={this.checkedItems} />
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
      </div>
    )
  }
}

const Banner = ({banner}) => (
  <div>
    <a href={banner.BannerHref} target="_blank">
      <img src={banner.BannerLink} alt={banner.BannerAlt} />
    </a>
  </div>
)