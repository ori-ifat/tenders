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
          <div className="grid-x" style={{paddingTop: '30px'}}>
            <div className="large-6 cell">{t('tender.didLike')}</div>
            <div className="large-6 cell">
              <button styleName="button-like" onClick={() => this.likeTender(true)}>{t('tender.liked')}</button>
              <button styleName="button-dislike" onClick={() => this.likeTender(false)}>{t('tender.disliked')}</button>
            </div>
          </div>
        }
      </div>
    )
  }
}
