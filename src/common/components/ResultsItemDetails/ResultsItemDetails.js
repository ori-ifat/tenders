import React from 'react'
import { number, string, func } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import {setDateLabel, isDateInRange} from 'common/utils/item'
import {createUrl, getEmailData, clearCache} from 'common/services/apiService'
import moment from 'moment'
import ImageView from 'common/components/ImageView'
import Row from './Row'
import Reminder from 'common/components/Reminder'
import Feedback from './Feedback'
import CSSModules from 'react-css-modules'
import styles from './ResultsItemDetails.scss'

const req = require.context('common/style/icons/', false)
const thumbSrc = req('./preview.svg')
const docSrc = req('./doc.svg')
const printSrc = req('./print_gray.svg')
const mailSrc = req('./mail_gray.svg')
const alertSrc = req('./alert.svg')
const favSrc = req('./fav.svg')

@translate()
@inject('itemStore')
@CSSModules(styles, {allowMultiple: true})
@observer
export default class ResultsItemDetails extends React.Component {

  static propTypes = {
    itemID: number,
    onClose: func,
    showViewer: func,
    mode: string,
    onFav: func
  }

  @observable remindMe = false
  @observable IsFavorite = false

  componentWillMount() {
    const {itemStore, itemID} = this.props
    itemStore.loadTender(itemID).then(() => {
      this.IsFavorite = itemStore.item.IsFavorite || false
      //console.log('mount', this.IsFavorite)
    })
  }

  componentWillReceiveProps(nextProps, nextState) {
    const {itemStore, itemID} = nextProps
    itemStore.loadTender(itemID).then(() => {
      this.IsFavorite = itemStore.item.IsFavorite || false
      //console.log('receive', this.IsFavorite)
    })
  }

  email = () => {
    const {itemID, t} = this.props
    const item = [itemID]
    getEmailData(item).then(uid =>
      //console.log('email', uid)
      location.href = `mailto:someone@email.com?subject=${t('toolbar.emailSubject')}&body=${encodeURIComponent(t('toolbar.emailBody', {uid}))}`
    )
  }

  print = isBig => {
    const {itemID} = this.props
    const item = [itemID]
    const exportType = isBig ? 2 : 1
    window.open(createUrl('Export/ExportData', {
      ExportType: exportType,
      InfoList: item
    }, false), '_blank')
  }

  fav = () => {
    const {itemStore: {item}, onFav} = this.props
    if (onFav) {
      onFav(item.TenderID, !this.IsFavorite)
      clearCache()
      this.IsFavorite = !this.IsFavorite
      //console.log('added', this.IsFavorite)
    }
  }

  remind = open => {
    this.remindMe = open
  }

  formatText = text => {
    /* <a> tag fix for text */
    const {t} = this.props
    let title = '\$&' //regexp default
    const arr = text.split('##URL##')
    if (arr.length > 1 && arr[1] != '') {
      //if originalUrl has passed to this method, need to set it here
      const link = arr[1].split('_')  //it is built as ID_Title
      title = link[1]  //set the title
      //concat the url as is (regexp will fix it to be a link)
      text = `${arr[0]}<br />${t('tender.originalTitle')}<br />http://www.tenders.co.il/#/tender/${link[0]}`
    }
    const fixedText = text.replace(/((https|http):\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
      `<a target="_blank" href="\$&">${title}</a>`)

    return {__html: fixedText}
  }

  render() {
    const { itemStore, onClose, t } = this.props
    const item = toJS(itemStore.item)
    //console.log('render', this.IsFavorite)
    //for display
    const publishDate = setDateLabel(item.PublishDate, 'DD/MM/YYYY', t('tender.noDate'))
    const infoDateChk = moment(item.InfoDate)
    const format = infoDateChk.hour() == 0 && infoDateChk.minute() == 0 ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:mm'
    const infoDate = setDateLabel(item.InfoDate, format, t('tender.noDate'))
    //
    //infoDate
    const twoDaysLeft = isDateInRange(item.InfoDate, 2)
    const oneDayLeft = isDateInRange(item.InfoDate, 1)
    //tourDate
    const twoDaysLeftTour = isDateInRange(item.TourDate, 2)
    const oneDayLeftTour = isDateInRange(item.TourDate, 1)
    //fileName
    const fileName = item.File ? item.File.FileName : ''
    //original tender
    const originalUrl = item.OriginalID ? `##URL##${item.OriginalID}_${item.OriginalTitle}` : ''

    //for scroll pos of item
    const divTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
    const className = !this.props.mode ? 'reveal-overlay' : ''
    const subClassName = !this.props.mode ? 'reveal large' : ''

    return (
      <div className={className} style={{display: 'block'}}>
        <div className={subClassName} style={{display: 'block'}}>
          {!itemStore.resultsLoading &&
            <div styleName="view-details-wrapper" style={{top: (divTop + 10)}}>
              <div className="grid-x">
                <div className="large-12 cell">
                  {item.TenderType == t('tender.exclusive') && <span styleName="label" className="label">{t('tender.exclusive')}</span>}
                  {twoDaysLeft && !oneDayLeft && <span styleName="label alert">{t('tender.twoDaysLeft')}</span>}
                  {oneDayLeft && <span styleName="label alert">{t('tender.oneDayLeft')}</span>}
                  {twoDaysLeftTour && !oneDayLeftTour && <span styleName="label alert">{t('tender.twoDaysLeftTour')}</span>}
                  {oneDayLeftTour && <span styleName="label alert">{t('tender.oneDayLeftTour')}</span>}
                  <h1 styleName="item_title">{item.Title}</h1>
                  <h6 styleName="item_meta">{t('tender.publishedAt')}: {publishDate} &middot; {item.TenderType} &middot; {item.TenderID}</h6>
                  <hr />
                </div>
              </div>

              <div className="grid-x" styleName="tender_data">
                <div className="large-9 cell">
                  <Row label={t('tender.publisher')} data={item.Publisher} />
                  <Row label={t('tender.delivery')} data={infoDate} dir="ltr" />
                  <Row label={t('tender.details')} html={this.formatText(item.Summery)} />
                  {
                    item.Comment && item.Comment.trim() != '' &&
                    <Row label={t('tender.comment')} html={this.formatText(`${item.Comment}${originalUrl}`)} />
                  }
                  {
                    item.TourDetails && item.TourDetails.trim() != '' &&
                    <Row label={t('tender.tourDetails')} data={item.TourDetails} />
                  }
                  {
                    item.TenderConditions && item.TenderConditions.trim() != '' &&
                    <Row label={t('tender.tenderConditions')} data={item.TenderConditions} />
                  }
                  {
                    item.SubSubjects && item.SubSubjects.trim() != '' &&
                    <Row label={t('tender.subSubjects')} data={item.SubSubjects} />
                  }
                  {
                    item.TD.length > 0 &&
                    <Row label={t('tender.links')} data="&nbsp;" />
                  }
                  {
                    item.TD.map((link, index) => <div key={index}>
                      <div className="grid-x">
                        <div className="medium-3 cell">
                          &nbsp;
                        </div>
                        <div className="medium-9 cell">
                          <div styleName="item_key"><a href={link.DucuentLink} target="_blank">{link.DucuentName}</a></div>
                        </div>
                      </div>
                    </div>)
                  }
                  <Feedback feedback={item.Feedback} />
                </div>
                <div className="large-3 cell">

                  <ul className="no-bullet" styleName="tender_actions">
                    <li>{fileName != '' && <a onClick={() => this.props.showViewer(fileName, item.Title)}>
                      <img src={thumbSrc} />{t('tender.viewImage')}</a>}
                    </li>
                    {item.TenderLink && <li><a href={item.TenderLink} target="_blank"><img src={docSrc}/>{t('tender.toTenderDetails')}</a></li>}
                    {fileName != '' && <li><a onClick={() => this.print(true)}><img src={printSrc}/>{t('tender.printImage')}</a></li>}
                    <li><a onClick={() => this.print(false)}><img src={printSrc}/>{t('tender.print')}</a></li>
                    <li><a onClick={this.email}><img src={mailSrc}/>{t('tender.email')}</a></li>
                    <li><a onClick={() => this.remind(true)}>
                      <img src={alertSrc}/>
                      {t('tender.remind')}</a></li>
                    {!this.props.mode &&
                      <li><a onClick={this.fav}>
                        <img src={favSrc}/>
                        {this.IsFavorite ? t('tender.removeFromFav') : t('tender.addToFav')}</a></li>
                    }
                  </ul>
                </div>
              </div>
              {!this.props.mode &&
                <button className="close-button" data-close aria-label="Close modal" type="button" onClick={onClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
              }

            </div>
          }
          {itemStore.resultsLoading && <div>Loading...</div>}
        </div>
        {this.remindMe &&
          <Reminder
            tenderID={item.TenderID}
            onClose={() => this.remind(false)}
            title={item.Title}
            infoDate={item.InfoDate}
            reminderID={item.ReminderID}
          />
        }
      </div>
    )
  }
}
