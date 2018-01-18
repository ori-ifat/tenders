import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import {getHomeJSON} from 'common/services/apiService'
import ArticleItem from './ArticleItem'
import ContactForm from './ContactForm'
import Footer from 'common/components/Footer'
import CSSModules from 'react-css-modules'
import styles from './articles.scss'

@translate()
@CSSModules(styles, {allowMultiple: true})
@observer
export default class Article extends Component {

  @observable articles = []

  componentWillMount() {
    getHomeJSON('Articles', 'allArticles').then(res => {
      this.articles = res
    })
  }


  render() {
    const {t} = this.props

    return (
      <div>
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
              <ContactForm />
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
