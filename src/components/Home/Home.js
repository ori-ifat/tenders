import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './home.scss'
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
import remove from 'lodash/remove'

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

  onCheck = (checked, value) => {
    if (checked) {
      const item = { TenderID: value }
      if (!this.checkedItems.includes(item)) this.checkedItems.push(item)
    }
    else {
      remove(this.checkedItems, item => {
        return item.TenderID === value
      })
    }
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
                checkedItems={toJS(this.checkedItems)}
              />
              <Banner banner={toJS(homeStore.banner)} />
              <h6 styleName="more-tenders-title">{t('home.moreTenders')}</h6>
              <HomeList items={homeStore.resultsMore} />
            </div>
          </div>
        </div>
        <Toolbar checkedItems={toJS(this.checkedItems)} />
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
