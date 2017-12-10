import React from 'react'
import { object, func, bool } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import {setDateLabel, isDateInRange} from 'common/utils/item'
import {getImageUrl} from 'common/utils/util'
import moment from 'moment'
import find from 'lodash/find'
import replace from 'lodash/replace'
import Checkbox from 'common/components/Checkbox'
import ResultsItemDetails from 'common/components/ResultsItemDetails'
import ImageView from 'common/components/ImageView'
import Reminder from 'common/components/Reminder'
import LoginDialog from 'common/components/LoginDialog'
import CSSModules from 'react-css-modules'
import styles from './ResultsItem.scss'

const req = require.context('common/style/icons/', false)
const timeSrc = req('./Time.svg')
const favSrc = req('./fav.svg')
const favActSrc = req('./action_fav.svg')

@translate()
@inject('accountStore')
@inject('searchStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class ResultsItem extends React.Component {
  static propTypes = {
    item: object,
    onCheck: func,
    onFav: func,
    setReminder: func,
    checked: bool,
    fav: bool
  }

  @observable IsFavorite = false
  @observable viewBig = false
  @observable showLoginMsg = false
  @observable showImage = false
  @observable imageUrl = ''
  @observable imageTitle = ''
  @observable remindMe = false
  @observable showLoginMsg = false

  componentWillMount() {
    //set favorite state from props
    this.IsFavorite = this.props.fav
  }

  componentWillReceiveProps(nextProps, nextState) {
    //set favorite state from nextProps - ex. when Toolbar changes the item fav state
    if (this.IsFavorite !== nextProps.fav) this.IsFavorite = nextProps.fav
  }

  addFav = () => {
    const { item, onFav, accountStore } = this.props
    if (accountStore.profile) {
      //callee + local fav state
      onFav(item.TenderID, !this.IsFavorite)
      this.IsFavorite = !this.IsFavorite
    }
    else {
      this.showLoginMsg = true
    }
  }

  viewDetails = id => {
    const {accountStore} = this.props
    if (accountStore.profile) {
      this.viewBig = true
    }
    else {
      this.showLoginMsg = true
    }
  }

  closeDetails = () => {
    this.viewBig = false
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

  markUpText = text => {
    /* highlight text if text search\text filter was made */
    const {searchStore} = this.props
    //get text filter or text tag
    const filter = find(searchStore.filters, filter => {
      return filter.field == 'searchtext'
    })
    const tag = find(searchStore.tags, tag => {
      return tag.ResType == 'tender_partial'
    })
    //alter the text to inject as html
    let fixedText = filter ? replace(text, new RegExp(filter.values[0], 'g'), `<span style="background-color: yellow">${filter.values[0]}</span>`) : text
    fixedText = tag ? replace(fixedText, new RegExp(tag.Name, 'g'), `<span style="background-color: yellow">${tag.Name}</span>`): fixedText
    return {__html: fixedText}
  }

  remind = open => {
    const {accountStore} = this.props
    if (accountStore.profile) {
      this.remindMe = open
    }
    else {
      this.showLoginMsg = true
    }
  }

  notlogged = () => {
    this.showLoginMsg = true
  }

  continueUnlogged = () => {
    this.showLoginMsg = false
  }

  render() {
    const { accountStore, item, onCheck, checked, onFav, t } = this.props
    const cbItem = Object.assign({}, item, {checked, IsFavorite: this.IsFavorite}) //merge this.IsFavorite to current item
    //if logged:
    const logged = accountStore.profile ? true : false
    //display issues
    const publishDate = setDateLabel(item.PublishDate, 'DD-MM-YYYY', t('tender.noDate'))
    const tenderStyle = checked ? 'tender_summery checked' : 'tender_summery'
    //infoDate
    const twoDaysLeft = isDateInRange(item.InfoDate, 2)
    const oneDayLeft = isDateInRange(item.InfoDate, 1)
    //tourDate
    const twoDaysLeftTour = isDateInRange(item.TourDate, 2)
    const oneDayLeftTour = isDateInRange(item.TourDate, 1)

    return (
      <div styleName={tenderStyle} >
        <div className="grid-x">
          <div className="small-9 cell">
            {onCheck && <Checkbox checked={checked} item={cbItem} onChange={onCheck} />}
            <div styleName="tender_txt_wraper">
              {item.TenderType == t('tender.exclusive') && <span styleName="label" className="label">{t('tender.exclusive')}</span>}
              {twoDaysLeft && !oneDayLeft && <span styleName="label alert">{t('tender.twoDaysLeft')}</span>}
              {oneDayLeft && <span styleName="label alert">{t('tender.oneDayLeft')}</span>}
              {twoDaysLeftTour && !oneDayLeftTour && <span styleName="label alert">{t('tender.twoDaysLeftTour')}</span>}
              {oneDayLeftTour && <span styleName="label alert">{t('tender.oneDayLeftTour')}</span>}
              <h3
                onClick={() => this.viewDetails(item.TenderID)}                
                styleName="item-title"
                dangerouslySetInnerHTML={this.markUpText(item.Title)}></h3>
              { logged &&
                <div styleName="tender_desc">
                  <p dangerouslySetInnerHTML={this.markUpText(item.Summery)}></p>
                </div>
              }
              <div className="tender_meta">
                <span>{t('tender.publishedAt')}: {publishDate}</span>
                <span styleName="divider">•</span>
                { logged &&
                  <span>
                    <span>{item.Publisher}</span>
                    <span styleName="divider">•</span>
                  </span>
                }
                <span>{item.TenderType}</span>
                <span styleName="divider">•</span>
                <span>#{item.TenderID}</span>
              </div>
            </div>

          </div>
          <div className="small-3 cell">
            <div styleName="tender_action_wraper">
              <ul className="no-bullet">
                <li><a onClick={() => this.remind(true)}><img src={timeSrc} alt="" />
                  {item.ReminderDate ?
                    moment(item.ReminderDate).format('DD-MM-YYYY') :
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
        {this.viewBig && !this.showImage && logged &&
          <ResultsItemDetails
            itemID={item.TenderID}
            onClose={this.closeDetails}
            showViewer={this.showViewer}
            onFav={onFav}
          />}
        {this.viewBig && this.showImage && logged &&
          <ImageView
            onClose={this.closeViewer}
            url={this.imageUrl}
            title={this.imageTitle}
          />
        }
        {this.remindMe && logged &&
          <Reminder
            tenderID={item.TenderID}
            onClose={() => this.remind(false)}
            title={item.Title}
            infoDate={item.InfoDate}
            reminderID={item.ReminderID}
          />
        }
        {this.showLoginMsg &&
          <LoginDialog
            onCancel={this.continueUnlogged}
          />
        }
      </div>
    )
  }
}
