import React from 'react'
import { inject, observer } from 'mobx-react'
import { translate } from 'react-polyglot'
import CSSModules from 'react-css-modules'
import styles from './ResultsActions.scss'

@translate()
@inject('searchStore')
@CSSModules(styles, { allowMultiple: true })
@observer
export default class ResultsActions extends React.Component {

  render() {
    const { t, sort } = this.props
    const sortBy = sort && sort == 'infoDate' ? t('results.infoDate') : t('results.endDate')

    return (
      <div styleName="select_all">
        <div styleName="grid-x">
          <div styleName="small-6 cell">
            <div styleName="checkbox">
              <input type="checkbox" />
              <label>{t('results.selectAll')}</label>
            </div>
          </div>
          <div styleName="small-6 cell">
            <ul styleName="dropdown menu align-left sort" id="sort" data-dropdown-menu data-disable-hover="true" data-click-open="true">
              <li>
                <a href="#">{t('results.sortBy')}: {sortBy}</a>
                <ul styleName="menu">
                  <li><a href="#">{t('results.infoDate')}</a></li>
                  <li><a href="#">{t('results.endDate')}</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
