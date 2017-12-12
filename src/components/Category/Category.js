import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, toJS} from 'mobx'
import { withRouter } from 'react-router'
import {translate} from 'react-polyglot'
import {getSampleTendersBySub} from 'common/services/apiService'
import moment from 'moment'
import Tender from '../Home/Items/Tender'
import Footer from '../Home/Items/Footer'
import CSSModules from 'react-css-modules'
import styles from './category.scss'

@translate()
@withRouter
@CSSModules(styles, {allowMultiple: true})
@observer
export default class Category extends Component {

  @observable count = 0
  @observable name = ''
  @observable tenders = []

  componentWillMount() {
    //router props:
    const {match: {params: { count, id, name }}} = this.props
    console.log(count, id, name)
    this.count = count
    this.name = name
    getSampleTendersBySub(id).then(data => {
      this.tenders = data
    })
  }

  render() {
    const {t} = this.props
    return (
      <div>
        <section id="category">

          <div className="row">
            <div className="large-12 columns">
              <h1 styleName="cat_name">
                <span id="spSubName">{this.name}</span>
                <span styleName="cat_counter">
                  <span id="spTotal">{this.count}</span> {t('cat.opportunities')}</span></h1>
            </div>
          </div>

          <div className="row">
            <div className="large-12 columns">
              {
                this.tenders.map(tender =>
                  <Tender
                    key={tender.infoId}
                    date={moment(tender.releaseDate).format('DD/MM/YYYY')}
                    title={tender.title}
                    subSubject={tender.subsubjectName}
                  />
                )
              }

            </div>
          </div>
        </section>
        <section id="shaow_all_box">
          <div className="row collapse">
            <div className="large-12 columns">
              <div className="sa_container">
                <h2 styleName="form-title">{t('cat.viewAll')}?</h2>
                <p className="text-center" styleName="form-subtitle">{t('cat.leaveDetails')}</p>
                <div className="row">
                  <div className="medium-10 large-8 columns medium-centered">
                    <span className="success label hide">{t('cat.sent')}</span>
                    <div id="lead_form" className="clearfix">
                      <div styleName="form_input_hor form_input_container">
                        <input id="name" type="text" />
                        <label>{t('cat.name')}:</label>
                      </div>

                      <div styleName="form_input_hor form_input_container">
                        <input id="mail" type="email" />
                        <label>{t('cat.email')} </label>
                      </div>

                      <div styleName="form_input_hor form_input_container">
                        <input id="phone" type="tel" />
                        <label>{t('cat.phone')}</label>
                      </div>
                      <div styleName="form_input_hor form_input_container submit">
                        <input type="submit" id="send" className="button send-cat-form" value="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer
          rights={t('home.rights')}
          service={t('home.service')}
        />
      </div>
    )
  }
}
