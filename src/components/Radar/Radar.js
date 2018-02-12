import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import {getHomeJSON} from 'common/services/apiService'
import Footer from 'common/components/Footer'
import ContactForm from 'components/Articles/ContactForm'
import DocumentMeta from 'react-document-meta'
import {getMetaData} from 'common/utils/meta'
import CSSModules from 'react-css-modules'
import styles from './radar.scss'

@translate()
@CSSModules(styles)
@observer
export default class Radar extends Component {

  @observable data;

  componentWillMount() {
    getHomeJSON('Radar', 'radar').then(res => {
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
            <div className="large-8 columns">
              <div styleName="post_wrapper">
                <h1 styleName="title">{t('radar.title')}</h1>
                <h2 styleName="subtitle">{t('radar.subTitle')}</h2>
                <hr styleName="divider" />

              </div>
              {data &&
              <div>
                <div dangerouslySetInnerHTML={{__html: data.line1}}></div>
                <div dangerouslySetInnerHTML={{__html: data.line2}}></div>
                <div dangerouslySetInnerHTML={{__html: data.line3}}></div>
                <div dangerouslySetInnerHTML={{__html: data.line4}}></div>
                <div dangerouslySetInnerHTML={{__html: data.comment}}></div>
              </div>
              }
            </div>

            <div className="large-4 columns">
              <ContactForm />
            </div>

          </div>
        </section>
        <Footer />

      </div>
    )
  }
}
