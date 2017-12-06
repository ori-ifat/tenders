import React, {Component} from 'react'
import { object, func } from 'prop-types'
import SearchInput from 'common/components/SearchInput'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import { homeStore, accountStore } from 'stores'
import { translate } from 'react-polyglot'
import HomeTitle from './HomeTitle'
import HomeList from './HomeList'
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
@inject('accountStore')
@inject('recordStore')
@CSSModules(styles)
@observer
export default class Home extends Component {

  static propTypes = {
    setSelectedFilters: func,
    selectedFilters: object,
    onCheck: func,
    onFav: func
  }

  componentWillMount() {
    //console.log('mount')
  }

  componentWillReceiveProps(nextProps, nextState) {
    //console.log('receive props')
    //this.props.cleanChecked()
  }

  render() {
    const { homeStore, t } = this.props
    const {onCheck, onFav} = this.props
    const {recordStore: {checkedItems}} = this.props

    return (
      <div>
        <div className="row">
          <div className="column large-12">
            <div styleName="search-div" >
              <SearchInput />
              <HomeTitle />
              <HomeList
                items={homeStore.results}
                onCheck={onCheck}
                onFav={onFav}
                checkedItems={checkedItems}
              />
              <Banner banner={toJS(homeStore.banner)} />
              <h6 styleName="more-tenders-title">{t('home.moreTenders')}</h6>
              <HomeList
                items={homeStore.resultsMore}                
                onFav={onFav}
              />
            </div>
          </div>
        </div>
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
