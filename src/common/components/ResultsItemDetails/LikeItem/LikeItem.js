import React from 'react'
import { inject, observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './LikeItem.scss'

@translate()
@inject('itemStore')
@CSSModules(styles)
@observer
export default class LikeItem extends React.Component {

  likeTender = liked => {
    const { itemStore: { item } } = this.props
    console.log('liked', item.TenderID, liked)
  }

  render() {
    const {t} = this.props
    return (
      <div className="grid-x" style={{paddingTop: '30px'}}>
        <div className="large-6 cell">{t('tender.didLike')}</div>
        <div className="large-6 cell">
          <button styleName="button-like" onClick={() => this.likeTender(true)}>{t('tender.liked')}</button>
          <button styleName="button-dislike" onClick={() => this.likeTender(false)}>{t('tender.disliked')}</button>
        </div>
      </div>
    )
  }
}
