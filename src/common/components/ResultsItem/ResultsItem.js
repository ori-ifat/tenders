import React from 'react'
import { object, func, bool } from 'prop-types'
import { observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './ResultsItem.scss'
import moment from 'moment'
import Checkbox from 'common/components/Checkbox'


const req = require.context('common/style/icons/', false)
const timeSrc = req('./Time.svg')
const favSrc = req('./fav.svg')

@translate()
@CSSModules(styles, { allowMultiple: true })
@observer
export default class ResultsItem extends React.Component {
  static propTypes = {
    item: object,
    onClick: func,
    onCheck: func,
    checked: bool
  }

  render() {
    const { item, onClick, onCheck, checked, t } = this.props
    const publishDate = item.PublishDate != null ? moment(item.PublishDate).format('DD-MM-YYYY') : t('tender.noDate')
    const tenderStyle = checked ? 'tender_summery checked' : 'tender_summery'
    //infoDate
    const twoDaysLeft = moment(item.InfoDate) > moment() && moment(item.InfoDate) < moment().add(2, 'days')
    const oneDayLeft = moment(item.InfoDate) > moment() && moment(item.InfoDate) < moment().add(1, 'days')
    //tourDate
    const twoDaysLeftTour = moment(item.TourDate) > moment() && moment(item.TourDate) < moment().add(2, 'days')
    const oneDayLeftTour = moment(item.TourDate) > moment() && moment(item.TourDate) < moment().add(1, 'days')

    return (
      <div styleName={tenderStyle}>
        <div styleName="grid-x">
          <div styleName="small-9 cell">
            {onCheck && <Checkbox checked={checked} value={item.TenderID} onChange={onCheck} />}
            <div styleName="tender_txt_wraper">
              {item.TenderType == t('tender.exclusive') && <span styleName="label">{t('tender.exclusive')}</span>}
              {twoDaysLeft && !oneDayLeft && <span styleName="label alert">{t('tender.twoDaysLeft')}</span>}
              {oneDayLeft && <span styleName="label alert">{t('tender.oneDayLeft')}</span>}
              {twoDaysLeftTour && !oneDayLeftTour && <span styleName="label alert">{t('tender.twoDaysLeftTour')}</span>}
              {oneDayLeftTour && <span styleName="label alert">{t('tender.oneDayLeftTour')}</span>}
              <h3 onClick={onClick} style={{cursor: 'pointer'}}>{item.Title}</h3>
              <div styleName="tender_desc">
                <p>{item.Summery}</p>
              </div>
              <div className="tender_meta">
                <span>{t('tender.publishedAt')}: {publishDate}</span>
                <span styleName="divider">•</span>
                <span>{item.Publisher}</span>
                <span styleName="divider">•</span>
                <span>{item.TenderType}</span>
                <span styleName="divider">•</span>
                <span>#{item.TenderID}</span>
              </div>
            </div>

          </div>
          <div styleName="small-3 cell">
            <div styleName="tender_action_wraper">
              <ul styleName="no-bullet">
                <li><a href="#"><img src={timeSrc} alt="" />24.8.2017</a></li>
                <li><a href="#"><img src={favSrc} alt="" />{t('tender.addToFav')}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
