import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './home.scss'
import SearchInput from 'components/SearchInput'
import Test from 'components/Test'
import {inject, observer} from 'mobx-react'
import {/*observable, */ toJS} from 'mobx'
import { whenRouted } from 'common/utils/withRouteHooks'
import { withRouter } from 'react-router'
import { homeStore } from 'stores'
import { translate } from 'react-polyglot'
import HomeTitle from './HomeTitle'
import Record from 'common/components/Record'

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

  //@observable request

  render() {
    const { homeStore, t } = this.props

    return (
      <div styleName="row">
        <div styleName="column large-12">
          <div styleName="search-div" >
            <SearchInput />
            {<HomeTitle />}
            <List items={homeStore.results} />
            <Banner banner={toJS(homeStore.banner)} />
            <h6 styleName="more-tenders-title">{t('home.moreTenders')}</h6>
            <List items={homeStore.resultsMore} />
          </div>
        </div>
      </div>
    )
  }
}

const List = ({items}) => (
  <div style={{marginBottom: '30px'}}>
    {items.map((item, index) => (
      <Record key={index} item={item} />
    ))}
  </div>
)

const Banner = ({banner}) => (
  <div>
    <a href={banner.BannerHref} target="_blank">
      <img src={banner.BannerLink} alt={banner.BannerAlt} />
    </a>
  </div>
)
