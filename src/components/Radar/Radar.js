import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import {getHomeJSON} from 'common/services/apiService'
import Footer from 'common/components/Footer'
import SmallContactForm from 'common/components/SmallContactForm'
import DocumentMeta from 'react-document-meta'
import {getMetaData} from 'common/utils/meta'
import CSSModules from 'react-css-modules'
import styles from './radar.scss'

const req = require.context('common/style/icons/', false)
const vIcon = req('./vIcon.svg')


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
            <div className="large-8 small-12 columns">

                <h1 styleName="title">{t('radar.title')}</h1>
                <h2 styleName="subtitle">{t('radar.subTitle')}</h2>



              {data &&
              <div styleName="content">
                <div styleName="item"><img src={vIcon}/> <p dangerouslySetInnerHTML={{__html: data.line1}}></p></div>
                <div styleName="item"><img src={vIcon}/> <p dangerouslySetInnerHTML={{__html: data.line2}}></p></div>
                <div styleName="item"><img src={vIcon}/> <p dangerouslySetInnerHTML={{__html: data.line3}}></p></div>
                <div styleName="item"><img src={vIcon}/> <p dangerouslySetInnerHTML={{__html: data.line4}}></p></div>
                <div styleName="item"><p dangerouslySetInnerHTML={{__html: data.comment}}></p></div>
              </div>
              }
            </div>

            <div className="large-4 small-12 columns">
              <SmallContactForm />
            </div>

          </div>
        </section>
        <Footer />

      </div>
    )
  }
}
