import React, {Component} from 'react'
import { withRouter } from 'react-router'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import {getHomeJSON} from 'common/services/apiService'
import SmallContactForm from 'common/components/SmallContactForm'
import Footer from 'common/components/Footer'
import DocumentMeta from 'react-document-meta'
import {getMetaData} from 'common/utils/meta'
import CSSModules from 'react-css-modules'
import styles from './sitemap.scss'

@withRouter
@translate()
@CSSModules(styles)
@observer
export default class SiteMap extends Component {

  @observable data;

  componentWillMount() {
    getHomeJSON('Sitemap', 'sitemap').then(res => {
      this.data = res
    })
  }


  render() {
    const {t} = this.props
    const {data} = this
    const meta = getMetaData(t('meta.homeTitle'), t('meta.homeDesc'), t('meta.homeKeywords'))

    return (
      <div>
        {data &&
        <section>
          <DocumentMeta {...meta} />
          <div className="row">
            <div className="large-12 columns">
              <h1 styleName="title">{t('footer.sitemap')}</h1>
              <hr styleName="divider" />
            </div>
          </div>
          <div style={{direction: 'ltr'}}>
            {
              data.urlset.url.map((url, index) => {
                return <div key={index} className="row">
                  <div className="large-12 columns" style={{margin: '5px'}}>
                    <a href={url.loc} target="_blank">{decodeURIComponent(url.loc)}</a>
                  </div>
                </div>
              })
            }
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
