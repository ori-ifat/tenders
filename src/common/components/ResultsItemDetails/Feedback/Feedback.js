import React from 'react'
import {number} from 'prop-types'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import { translate } from 'react-polyglot'
import { setFeedback, clearCache } from 'common/services/apiService'
import CSSModules from 'react-css-modules'
import styles from './Feedback.scss'

@translate()
@inject('itemStore')
@CSSModules(styles, {allowMultiple: true})
@observer
export default class Feedback extends React.Component {

  static propTypes = {
    feedback: number
  }

  @observable feedback = 0
  @observable sent = false

  componentWillMount() {
    const {feedback} = this.props
    this.feedback = feedback
  }

  likeTender = liked => {
    const { itemStore: { item } } = this.props
    //console.log('liked', item.TenderID, liked)
    setFeedback(item.TenderID, liked ? 1 : -1).then(() => {
      clearCache()
      this.feedback = liked ? 1 : -1
      this.sent = true
    })
  }

  render() {
    const {t} = this.props
    const clsLike = this.feedback == 1 ? 'focused' : ''
    const clsDisLike = this.feedback == -1 ? 'focused' : ''
    return (
      <div>
        <div className="grid-x" styleName="likeitem">
          {this.sent ?
            <div className="large-6 cell" styleName="text">
              <p styleName="ttl">{t('tender.sentFeedback')}</p>
            </div>
            :
            <div className="large-6 cell" styleName="text">
              <p styleName="ttl">{t('tender.didLike')}</p>
              <p styleName="sub">{t('tender.didLikeSub')}</p>
            </div>
          }
          <div className="large-6 cell">
            <div styleName="buttons">
              <a className="button" styleName={`button-like ${clsLike}`} onClick={() => this.likeTender(true)}>{t('tender.liked')}</a>
              <a className="button" styleName={`button-dislike ${clsDisLike}`} onClick={() => this.likeTender(false)}>{t('tender.disliked')}</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
