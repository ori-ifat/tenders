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
import {setCheckedStatus, setFavStatus} from 'common/utils/util'
import {addToFavorites, clearCache} from 'common/services/apiService'
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

  componentWillMount() {
    //console.log('mount')
  }

  componentWillReceiveProps(nextProps, nextState) {
    //console.log('receive props')
    this.checkedItems = []
  }

  onCheck = (checked, value, isFavorite) => {
    console.log('onCheck', checked, value, isFavorite)
    setCheckedStatus(this.checkedItems, checked, value, isFavorite)
    console.log(this.checkedItems)
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

  render() {
    const { homeStore, t } = this.props

    return (
      <div>
        <div styleName="row">
          <div styleName="column large-12">
            <div styleName="search-div" >
              <SearchInput />
              {<HomeTitle />}
              <HomeList
                items={homeStore.results}
                onCheck={this.onCheck}
                onFav={this.onFav}
                checkedItems={this.checkedItems}
              />
              <Banner banner={toJS(homeStore.banner)} />
              <h6 styleName="more-tenders-title">{t('home.moreTenders')}</h6>
              <HomeList
                items={homeStore.resultsMore}
                onFav={this.onFav}
              />
            </div>
          </div>
        </div>
        <Toolbar checkedItems={this.checkedItems} />
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
