import React, {Component} from 'react'
import { withRouter } from 'react-router'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import {getHomeJSON, getSampleTenders2, getSampleTendersBySub} from 'common/services/apiService'
import moment from 'moment'
import ContactUs from 'common/components/ContactUs'
import TenderItem from 'common/components/TenderItem/TenderItem'
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
    const {match: {params: { name }}, t} = this.props
    const {data} = this
    const short = data ? data.title.replace(/`${t('footer.tenders')}`\s/g, '') : ''
    const tag = t(`footer.${name}`)
    const metaTitle = t('meta.catResultsTitle', {tag})
    const metaDesc = t('meta.catResultsDesc', {tag})
    const metaKW = t('meta.catKeywords', {tag})
    const meta = getMetaData(metaTitle, metaDesc, metaKW)

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
                <TenderItem
                  key={index}
                  date={moment(tender.releaseDate).format('DD/MM/YYYY')}
                  title={tender.title}
                  subSubject={tender.subsubjectName}
                />
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
