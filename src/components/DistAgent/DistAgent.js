import React, {Component} from 'react'
import { withRouter } from 'react-router'
import { whenRouted } from 'common/utils/withRouteHooks'
import { func } from 'prop-types'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import {translate} from 'react-polyglot'
import { distAgentStore } from 'stores'
import moment from 'moment'
import { decrypt } from 'caesar-encrypt'
import List from 'common/components/List'
import NoData from 'components/NoData'
import NotLogged from 'common/components/NotLogged'
import Loading from 'common/components/Loading/Loading'
import ResultsItem from 'common/components/ResultsItem'
import find from 'lodash/find'
import CSSModules from 'react-css-modules'
import styles from './distagent.scss'

@withRouter
@whenRouted(({ params: { uid, type } }) => {
  distAgentStore.clearResults()
  distAgentStore.loadNextResults(uid, type)
})
@translate()
@inject('accountStore')
@inject('distAgentStore')
@inject('recordStore')
@CSSModules(styles)
@observer
export default class DistAgent extends Component {

  static propTypes = {
    onCheck: func,
    onFav: func
  }

  @observable allowCheck = true

  componentWillMount() {
    //const { match: {params: { uid }} } = this.props
    //console.log(uid)
    //temp patch: redirect to old site page
    //location.href = `http://info.tenders.co.il/DistAgent/DistAgent.aspx?uid=${uid}`
    const {showNotification, match: { params: { uid, type } }} = this.props
    showNotification(true)
    if (type) {
      const decrypted = decrypt(type, 20)
      if (moment(decrypted, 'YYYY-MM-DD')._isValid) {
        //_isValid - means that the encrypted string is originated from a moment date format
        this.allowCheck = false   //if 'type' param was sent, hide checkboxes
      }
    }
  }


  render() {
    const {accountStore, distAgentStore, distAgentStore: {results, resultsLoading, resultsCount}, t} = this.props
    const {onCheck, onFav, recordStore: {checkedItems}} = this.props
    const items = results.map((item, index) => {
      //const { checkedItems } = this.props
      const found = find(checkedItems, chk => {
        return chk.TenderID == item.TenderID
      })
      const checked = found ? found.checked : false
      const fav = found ? found.IsFavorite : item.IsFavorite

      return <ResultsItem
        key={index}
        item={item}
        onCheck={this.allowCheck ? onCheck : undefined}
        onFav={onFav}
        checked={checked}
        fav={fav}
      />
    })

    return (
      <div style={{marginTop: '50px'}}>
        {resultsLoading && <Loading />}
        {resultsCount == 0 && !resultsLoading && <NoData error={distAgentStore.searchError} />}
        {resultsCount > 0 &&
          <div>
            <div className="row">
              <div className="large-12 columns">
                <h1 styleName="title">{t('distagent.titlePart1')} <span styleName="num">{resultsCount}</span> {t('distagent.titlePart2')}</h1>
              </div>
            </div>
            <div className="row">
              <div className="columns large-12">
                <hr />
                {items}
              </div>
            </div>
          </div>
        }
      </div>)
  }
}
