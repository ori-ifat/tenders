import React from 'react'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import moment from 'moment'
import ImageViewer from 'common/components/ImageViewer'
import CSSModules from 'react-css-modules'
import styles from './ResultsItemDetails.scss'

const req = require.context('common/style/icons/', false)
const thumbSrc = req('./thumb.jpg')

@translate()
@inject('itemStore')
@CSSModules(styles, {allowMultiple: true})
@observer
export default class ResultsItemDetails extends React.Component {

  @observable showImage = false

  componentWillMount() {
    const {itemStore, itemID} = this.props
    itemStore.loadTender(itemID)
  }

  componentWillReceiveProps(nextProps, nextState) {
    const {itemStore, itemID} = nextProps
    itemStore.loadTender(itemID)
  }

  showViewer = () => {
    this.showImage = true
  }

  closeViewer = () => {
    this.showImage = false
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
    //for scroll pos of item
    const divTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
    return (
      <div styleName="reveal-overlay" style={{display: 'block'}}>
        <div styleName="reveal" style={{display: 'block'}}>
          {/*<div>{item.TenderID} <a onClick={onClose}>close</a></div>*/}
          {!itemStore.resultsLoading &&
            <div styleName="view-details-wrapper" style={{top: (divTop + 10)}}>
              {item.TenderType == t('tender.exclusive') && <span styleName="label">{t('tender.exclusive')}</span>}
              {twoDaysLeft && !oneDayLeft && <span styleName="label alert">{t('tender.twoDaysLeft')}</span>}
              {oneDayLeft && <span styleName="label alert">{t('tender.oneDayLeft')}</span>}
              {twoDaysLeftTour && !oneDayLeftTour && <span styleName="label alert">{t('tender.twoDaysLeftTour')}</span>}
              {oneDayLeftTour && <span styleName="label alert">{t('tender.oneDayLeftTour')}</span>}
              <h1 styleName="item_title">{item.Title}</h1>
              <h6>{t('tender.publishedAt')}: {publishDate} &middot; {item.TenderType} &middot; {item.TenderID}</h6>
              <hr />
              <div styleName="clearfix">
                <div styleName="table-left-end"><a onClick={this.showViewer}><img src={thumbSrc} /></a></div>
                <div styleName="table-right">{t('tender.publisher')}
                </div>
                <div styleName="table-left">{item.Publisher}
                </div>
                <div styleName="table-right">{t('tender.delivery')}
                </div>
                <div styleName="table-left">{infoDate}
                </div>
                <div styleName="table-right">{t('tender.details')}
                </div>
                <div styleName="table-left">{item.Summery}
                </div>
              </div>
              <a onClick={onClose}>close</a>
              {this.showImage &&
                <div style={{position: 'absolute', left: 0, top: 0, width: '400px'}}>
                  <a style={{backgroundColor: 'magenta'}} onClick={this.closeViewer}>((X))</a>
                  <div style={{position: 'absolute', left: 0, top: 0, width: '300px'}}>
                    <ImageViewer top={(divTop + 10)} />
                  </div>
                </div>
              }
            </div>
          }
          {itemStore.resultsLoading && <div>Loading...</div>}
        </div>
      </div>
    )
  }
}
