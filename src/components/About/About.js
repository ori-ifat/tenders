import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import {getHomeJSON} from 'common/services/apiService'
import Footer from 'common/components/Footer'
import SmallContactForm from 'common/components/SmallContactForm'
import ContactAction from 'common/components/ContactAction'
import DocumentMeta from 'react-document-meta'
import {getMetaData} from 'common/utils/meta'
import CSSModules from 'react-css-modules'
import styles from './about.scss'

const req = require.context('common/style/icons/', false)
const vIcon = req('./vIcon.svg')

@translate()
@CSSModules(styles)
@observer
export default class About extends Component {

  @observable data;

  componentWillMount() {
    getHomeJSON('About', 'about').then(res => {
      this.data = res
    })
  }

  render() {
    const {t} = this.props
    const {data} = this
    const meta = getMetaData(t('meta.homeTitle'), t('meta.homeDesc'), t('meta.homeKeywords'))

    return (
      <div>
        <DocumentMeta {...meta} />
        <section id="articles">
          <div className="row">
            <div className="large-8 small-12 columns">
              <h1 styleName="title">{t('about.title')}</h1>
              <h2 styleName="subtitle">{t('about.subTitle')}</h2>
              {data &&
              <div styleName="content">
                <div styleName="item"><p dangerouslySetInnerHTML={{__html: data.line1}}></p></div>
                <div styleName="item"><p dangerouslySetInnerHTML={{__html: data.line2}}></p></div>
                <div styleName="item"><p dangerouslySetInnerHTML={{__html: data.line3}}></p></div>
                <div styleName="item"><p dangerouslySetInnerHTML={{__html: data.line4}}></p></div>
                <div styleName="item"><p dangerouslySetInnerHTML={{__html: data.line5}}></p></div>

                <div style={{marginBottom: '50px'}}>
                  <div style={{fontWeight: 'bold', marginTop: '20px', marginBottom: '10px'}}>{data.customers.title}</div>
                  {
                    data.customers.items.map((customer, index) => <div key={index} styleName="costomer_types"><img src={vIcon} />{customer.title}</div>)
                  }
                </div>
              </div>
              }
            </div>
            <div className="large-4 small-12 columns">
              <SmallContactForm />
            </div>
          </div>
        </section>
        <Footer />
        <ContactAction />
      </div>
    )
  }
}
