import React, {Component} from 'react'
import { withRouter } from 'react-router'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import {getHomeJSON} from 'common/services/apiService'
import ContactForm from 'components/Articles/ContactForm'
import Footer from 'common/components/Footer'
import CSSModules from 'react-css-modules'
import styles from './article.scss'

@withRouter
@translate()
@CSSModules(styles, {allowMultiple: true})
@observer
export default class Article extends Component {

  @observable article;

  componentWillMount() {
    const { match: {params: { id }} } = this.props
    getHomeJSON('Articles', `article${id}`).then(res => {
      this.article = res
    })
  }


  render() {
    const {t} = this.props
    const {article} = this

    return (
      <div>
      in progress ...
        {this.article &&
          <Footer
            rights={t('home.rights')}
            service={t('home.service')}
          />
        }
      </div>
    )
  }
}
