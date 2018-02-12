import React, {Component} from 'react'
import { withRouter } from 'react-router'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import {getHomeJSON, getSampleTenders2, getSampleTendersBySub} from 'common/services/apiService'
import ContactUs from '../Home/ContactUs'
import Footer from 'common/components/Footer'
import DocumentMeta from 'react-document-meta'
import {getMetaData} from 'common/utils/meta'
import CSSModules from 'react-css-modules'
import styles from './category.scss'

@withRouter
@translate()
@CSSModules(styles)
@observer
export default class Category extends Component {

  @observable data;
  @observable tenders = []

  componentWillMount() {
    const { match: {params: { id, name, mode }} } = this.props
    getHomeJSON('Categories', name).then(res => {
      this.data = res
    })
    if(mode && mode == 'cat') {
      getSampleTendersBySub(id).then(res => {
        this.tenders = res
      })
    }
    else {
      getSampleTenders2(id).then(res => {
        this.tenders = res
      })
    }
  }


  render() {
    const {t} = this.props
    const {data} = this
    const short = data ? data.title.replace(/`${t('footer.tenders')}`\s/g, '') : ''
    const meta = getMetaData(t('meta.homeTitle'), t('meta.homeDesc'), t('meta.homeKeywords'))

    return (
      <div>
        {data &&
        <section>
          <DocumentMeta {...meta} />
          <div className="row">
            <div className="large-12 columns">
              <h1 styleName="title">{data.title}</h1>
            </div>
          </div>
          <div className="row">
            <div className="large-12 columns">
              <div>{t('cat.subTitle', {short})}</div>
            </div>
          </div>
          <div className="row">
            <div className="large-12 columns">
              {this.tenders && this.tenders.length > 0 && this.tenders.map((tender, index) =>
                <div key={index}>{tender.title}</div>
              )}
            </div>
          </div>
          <div className="row collapse" style={{marginTop: '5rem'}}>
            <div className="large-12 columns">
              <ContactUs />
            </div>
          </div>
          <div className="row collapse" style={{marginTop: '5rem'}}>
            <div className="large-12 columns">
              {
                data.text && <div dangerouslySetInnerHTML={{__html: data.text}}></div>
              }
            </div>
          </div>
        </section>
        }
        {data &&
          <Footer />
        }
      </div>
    )
  }
}