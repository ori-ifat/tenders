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
      <div className="reveal-overlay" style={{display: 'block'}}>
        <div className="reveal large" style={{display: 'block'}}>
          {/*<div>{item.TenderID} <a onClick={onClose}>close</a></div>*/}
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
                    <div className="grid-x">
                      <div className="medium-3 cell"> 
                        <div styleName="item_lable">{t('tender.publisher')}</div>
                      </div>
                      <div className="medium-9 cell">
                      <div styleName="item_key">{item.Publisher} </div>
                      </div>
                    </div>

                    <div className="grid-x">
                      <div className="medium-3 cell">
                        <div styleName="item_lable">{t('tender.publisher')} </div>
                      </div>
                      <div className="medium-9 cell">
                        <div styleName="item_key">{infoDate}</div>
                      </div>
                    </div>

                    <div className="grid-x">
                      <div className="medium-3 cell">
                        <div styleName="item_lable">{t('tender.details')} </div>
                      </div>
                      <div className="medium-9 cell">
                        <div styleName="item_key">{item.Summery}</div>
                      </div>
                    </div>

                </div>
                <div className="large-3 cell">
                  <a onClick={this.showViewer}><img styleName="thender_thumb"  src={thumbSrc} /></a>
                  <ul className="no-bullet" styleName="tender_actions">
                    <li><a>למסמכי המכרז</a></li>
                    <li><a>הדפסה</a></li>
                    <li><a>שלח במייל</a></li>
                    <li><a>צור התראה</a></li>
                  </ul>
                </div>
                

              </div>
              <button className="close-button" data-close aria-label="Close modal" type="button" onClick={onClose}>
                  <span aria-hidden="true">&times;</span>
              </button>
              
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
