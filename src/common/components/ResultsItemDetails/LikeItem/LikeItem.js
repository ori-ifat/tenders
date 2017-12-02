import React from 'react'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import { translate } from 'react-polyglot'
import { setFeedback } from 'common/services/apiService'
import CSSModules from 'react-css-modules'
import styles from './LikeItem.scss'

@translate()
@inject('itemStore')
@CSSModules(styles)
@observer
export default class LikeItem extends React.Component {

  @observable sent = false

  likeTender = liked => {
    const { itemStore: { item } } = this.props
    //console.log('liked', item.TenderID, liked)
    setFeedback(item.TenderID, liked ? 1 : -1).then(() => {
      this.sent = true
    })
  }

  render() {
    const {t} = this.props
    return (
      <div>
        {this.sent ?
          <div className="grid-x" style={{paddingTop: '30px'}}>
            <div className="large-12 cell">{t('tender.sentFeedback')}</div>
          </div>
          :
          <div className="grid-x" styleName="likeitem">
            <div className="large-6 cell" styleName="text">
              <p styleName="ttl">{t('tender.didLike')}</p>
              <p styleName="sub">המידע יעזור לנו לשפר את הלהביא טקסט</p>
            </div>
            <div className="large-6 cell">
              <div styleName="buttons">
                <a className="button" styleName="button-like" onClick={() => this.likeTender(true)}>{t('tender.liked')}</a>
                <a className="button" styleName="button-dislike" onClick={() => this.likeTender(false)}>{t('tender.disliked')}</a>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}
