import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import {getHomeJSON} from 'common/services/apiService'
import ArticleItem from './ArticleItem'
import SmallContactForm from 'common/components/SmallContactForm'
import Footer from 'common/components/Footer'
import ContactAction from 'common/components/ContactAction'
import DocumentMeta from 'react-document-meta'
import {getMetaData} from 'common/utils/meta'
import CSSModules from 'react-css-modules'
import styles from './articles.scss'

@translate()
@CSSModules(styles)
@observer
export default class Article extends Component {

  @observable articles = []

  componentWillMount() {
    getHomeJSON('Articles', 'allArticles').then(res => {
      this.articles = res
    })
  }

  componentDidMount () {
    window.scrollTo(0, 0)
  }

  render() {
    const {t} = this.props
    const pageName = t('meta.articles')
    const meta = getMetaData(t('meta.pageTitle', {pageName}), t('meta.pageDesc', {pageName}), t('meta.pageKW', {pageName}))

    return (
      <div>
        <DocumentMeta {...meta} />
        <section id="articles">
          <div className="row">
            <div className="large-8 columns">
              <div styleName="post_wrapper">
                <h1 styleName="title">{t('articles.title')}</h1>

                <hr styleName="divider" />
                {
                  this.articles && this.articles.map((article, index) =>
                    <ArticleItem
                      key={index}
                      id={article.id}
                      title={article.title}
                      date={article.date}
                      author={article.author}
                      image={article.image}
                    />)
                }
              </div>
            </div>

            <div className="large-4 columns">
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
