import React from 'react'
import { inject, observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './ResultsItem.scss'
import moment from 'moment'

const req = require.context('common/style/icons/', false)
const timeSrc = req('./Time.svg')
const favSrc = req('./fav.svg')

@translate()
@inject('searchStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class ResultsItem extends React.Component {

  render() {
    const { item, t } = this.props
    const publishDate = moment(item.PublishDate).format('DD-MM-YYYY')

    return (
      <div styleName="tender_summery">
        <div styleName="grid-x">
          <div styleName="small-9 cell">
            <div styleName="checkbox_continer">
              <div styleName="checkbox">
                <input type="checkbox" className="checkbox_tender"/>
              </div>
            </div>
            <div styleName="tender_txt_wraper">
              <h3>{item.Title}</h3>
              <div styleName="tender_desc">
                <p>{item.Text}</p>
              </div>
              <div className="tender_meta">
                <span>{t('tender.publishedAt')}: {publishDate}</span>
                <span styleName="divider">•</span>
                <span>{t('tender.publishedAt')}: {publishDate}</span>
              </div>
            </div>

          </div>
          <div styleName="small-3 cell">
            <div styleName="tender_action_wraper">
              <ul styleName="no-bullet">
                <li><a href="#"><img src={timeSrc} alt="" />24.8.2017</a></li>
                <li><a href="#"><img src={favSrc} alt="" />{t('tender.addToFav')}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
