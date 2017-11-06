import React from 'react'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import moment from 'moment'
import ImageView from 'common/components/ImageView'
import Row from './Row'
import CSSModules from 'react-css-modules'
import styles from './ResultsItemDetails.scss'

const req = require.context('common/style/icons/', false)
const thumbSrc = req('./thumb.jpg')

@translate()
@inject('itemStore')
@CSSModules(styles, {allowMultiple: true})
@observer
export default class ResultsItemDetails extends React.Component {

  componentWillMount() {
    const {itemStore, itemID} = this.props
    itemStore.loadTender(itemID)
  }

  componentWillReceiveProps(nextProps, nextState) {
    const {itemStore, itemID} = nextProps
    itemStore.loadTender(itemID)
  }

  render() {
    //const { item, onClose } = this.props
    const { itemStore, onClose, t } = this.props
    const item = toJS(itemStore.item)
    //for display
    const publishDate = item.PublishDate != null ? moment(item.PublishDate).format('DD-MM-YYYY') : t('tender.noDate')
    const infoDate = item.InfoDate != null ? moment(item.InfoDate).format('DD-MM-YYYY HH:mm') : t('tender.noDate')
    //
    //infoDate
    const twoDaysLeft = moment(item.InfoDate) > moment() && moment(item.InfoDate) < moment().add(2, 'days')
    const oneDayLeft = moment(item.InfoDate) > moment() && moment(item.InfoDate) < moment().add(1, 'days')
    //tourDate
    const twoDaysLeftTour = moment(item.TourDate) > moment() && moment(item.TourDate) < moment().add(2, 'days')
    const oneDayLeftTour = moment(item.TourDate) > moment() && moment(item.TourDate) < moment().add(1, 'days')
    //fileName
    const fileName = item.File ? item.File.FileName : ''
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
                  {item.TenderType == t('tender.exclusive') && <span styleName="label">{t('tender.exclusive')}</span>}
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
                  <Row label={t('tender.delivery')} data={infoDate} />
                  <Row label={t('tender.details')} data={item.Summery} />
                  {
                    item.TourDetails &&
                    <Row label={t('tender.tourDetails')} data={item.TourDetails} />
                  }
                  {
                    item.TenderConditions &&
                    <Row label={t('tender.tenderConditions')} data={item.TenderConditions} />
                  }
                  {
                    item.SubSubjects &&
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
                </div>
                <div className="large-3 cell">
                  {fileName != '' && <a onClick={() => this.props.showViewer(fileName, item.Title)}><img styleName="thender_thumb"  src={thumbSrc} /></a>}
                  <ul className="no-bullet" styleName="tender_actions">
                    <li><a>{t('tender.toTenderDetails')}</a></li>
                    <li><a>{t('tender.print')}</a></li>
                    <li><a>{t('tender.email')}</a></li>
                    <li><a>{t('tender.remind')}</a></li>
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
      </div>
    )
  }
}
