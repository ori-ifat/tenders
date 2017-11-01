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
const favActSrc = req('./action_fav.svg')

@translate()
@CSSModules(styles, { allowMultiple: true })
@observer
export default class ResultsItem extends React.Component {
  static propTypes = {
    item: object,
    onClick: func,
    onCheck: func,
    onFav: func,
    setReminder: func,
    checked: bool,
    fav: bool
  }

  @observable IsFavorite = false
  @observable reminderDate = null

  componentWillMount() {
    //set favorite state from props
    this.IsFavorite = this.props.fav
  }

  componentWillReceiveProps(nextProps, nextState) {
    //set favorite state from nextProps - ex. when Toolbar changes the item fav state
    if (this.IsFavorite !== nextProps.fav) this.IsFavorite = nextProps.fav
  }

  addFav = () => {
    const { item, onFav } = this.props
    //callee + local fav state
    onFav(item.TenderID, !this.IsFavorite)
    this.IsFavorite = !this.IsFavorite
  }

  render() {
    const { item, onClick, onCheck, checked, onFav, setReminder, t } = this.props
    const cbItem = Object.assign({}, item, {IsFavorite: this.IsFavorite}) //merge this.IsFavorite to current item

    const publishDate = item.PublishDate != null ? moment(item.PublishDate).format('DD-MM-YYYY') : t('tender.noDate')
    const tenderStyle = checked ? 'tender_summery checked' : 'tender_summery'
    //infoDate
    const twoDaysLeft = moment(item.InfoDate) > moment() && moment(item.InfoDate) < moment().add(2, 'days')
    const oneDayLeft = moment(item.InfoDate) > moment() && moment(item.InfoDate) < moment().add(1, 'days')
    //tourDate
    const twoDaysLeftTour = moment(item.TourDate) > moment() && moment(item.TourDate) < moment().add(2, 'days')
    const oneDayLeftTour = moment(item.TourDate) > moment() && moment(item.TourDate) < moment().add(1, 'days')
    //reminder
    this.reminderDate = item.ReminderDate
    return (
      <div styleName={tenderStyle}>
        <div className="grid-x">
          <div className="small-9 cell">
            {onCheck && <Checkbox checked={checked} item={cbItem} onChange={onCheck} />}
            <div styleName="tender_txt_wraper">
              {item.TenderType == t('tender.exclusive') && <span styleName="label">{t('tender.exclusive')}</span>}
              {twoDaysLeft && !oneDayLeft && <span styleName="label alert">{t('tender.twoDaysLeft')}</span>}
              {oneDayLeft && <span styleName="label alert">{t('tender.oneDayLeft')}</span>}
              {twoDaysLeftTour && !oneDayLeftTour && <span styleName="label alert">{t('tender.twoDaysLeftTour')}</span>}
              {oneDayLeftTour && <span styleName="label alert">{t('tender.oneDayLeftTour')}</span>}
              <h3 onClick={() => onClick(item.TenderID)} style={{cursor: 'pointer'}}>{item.Title}</h3>
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
          <div className="small-3 cell">
            <div styleName="tender_action_wraper">
              <ul className="no-bullet">
                <li><a onClick={() => setReminder(item.TenderID, item.Title, item.InfoDate)}><img src={timeSrc} alt="" />
                  {this.reminderDate ?
                    moment(this.reminderDate).format('DD-MM-YYYY') :
                    t('tender.addReminder')}</a></li>
                {onFav &&
                  <li>
                    <a onClick={this.addFav}>
                      <img src={this.IsFavorite ? favActSrc : favSrc} alt="" />{this.IsFavorite ? t('tender.removeFromFav') : t('tender.addToFav')}
                    </a>
                  </li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
