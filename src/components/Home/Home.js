import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import SearchInput from 'common/components/SearchInput'
import CatItem from './Items/CatItem'
import SubCatItem from './Items/SubCatItem'
import ContactUs from 'common/components/ContactUs'
import Opportunity from './Items/Opportunity'
import Testemonial from './Items/Testemonial'
import TenderItem from './Items/TenderItem/TenderItem'
import Article from './Items/Article'
import YouTubeTip from './Items/YouTubeTip'
import Footer from 'common/components/Footer'
import Loading from 'common/components/Loading/Loading'
import moment from 'moment'
import {getHomeJSON} from 'common/services/apiService'
import {getMetaData} from 'common/utils/meta'
import {fixTopMenu} from 'common/utils/topMenu'
import { Link } from 'react-router-dom'
import DocumentMeta from 'react-document-meta'
import GTAG from 'common/utils/gtag'
//import {randomNumber} from 'common/utils/util'
//import ContactAction from 'common/components/ContactAction'
import CSSModules from 'react-css-modules'
import styles from './home.scss'
import 'common/style/home.css'

@translate()
@inject('homeStore')
@CSSModules(styles)
@observer
export default class Home extends Component {

  @observable allCats = false
  @observable opportunities = []
  @observable testemonials = []
  @observable articles = []
  @observable movies = []

  componentWillMount() {
    const {homeStore} = this.props
    homeStore.loadCatResults().then(() => {
      homeStore.loadSubCatResults()
    })
    homeStore.loadSampleTenders()
    //json data for hard-coded stuff:
    //const cache = randomNumber(100000, 1000000)
    const cache = 100000  //if needed, use the random number when articles change
    getHomeJSON('Articles', 'articles-preview', cache).then(res => {
      this.articles = res
    })
    getHomeJSON('Opportunities', 'opportunities').then(res => {
      this.opportunities = res
    })
    getHomeJSON('Testemonials', 'testemonials').then(res => {
      this.testemonials = res
    })
    getHomeJSON('Movies', 'movies').then(res => {
      this.movies = res
    })
    fixTopMenu()
    GTAG.trackPage('Home', 'home')
  }

  showAllCats = () => {
    this.allCats = !this.allCats
  }

  render() {
    const {homeStore, homeStore: {resultsLoading},  t} = this.props
    const catStyle = this.allCats ? '' : 'hide'
    const catLabel = this.allCats ? t('home.hideAllCat') : t('home.showAllCat')
    const meta = getMetaData(t('meta.homeTitle'), t('meta.homeDesc'), t('meta.homeKeywords'))

    return (
      <div className="bg">
        <DocumentMeta {...meta} />
        <section styleName="hero">
          <div className="row">
            <div className="columns large-12">
              <h1 styleName="hero_txt">{t('home.mainTitle')}<br /> {t('home.mainTitle2')}!</h1>
              <p styleName="sub_head">{/*t('home.subTitle')*/}</p>
            </div>
          </div>
          <div className="row">
            <div className="column large-9 large-centered">
              <SearchInput />
            </div>
          </div>

        </section>

        <section id="categories">
          <div className="row">
            <div className="large-12 columns">
              <h2 styleName="cat-title" >{t('home.catTitle')}</h2>
              <div className="row collapse small-up-1 medium-up-2 large-up-4">
                {resultsLoading && <Loading />}
                {!resultsLoading && homeStore.catResults.map((cat, index) =>
                  <CatItem
                    key={index}
                    count={cat.count}
                    subSubjectID={cat.subsubjectId}
                    catName={cat.subsubjectName}
                  />)
                }
              </div>

              <div id="other_cat" styleName={catStyle}>
                <div className="row collapse small-up-1 medium-up-2 large-up-4">
                  {!resultsLoading && homeStore.subCatResults.map((cat, index) =>
                    <SubCatItem
                      key={index}
                      count={cat.count}
                      subSubjectID={cat.subsubjectId}
                      catName={cat.subsubjectName}
                    />)
                  }
                </div>
              </div>

              <a onClick={this.showAllCats} styleName="show_all">{catLabel}</a>
            </div>
          </div>
        </section>
        <section style={{marginTop: '5rem'}}>
          <div className="row collapse">
            <div className="large-12 columns">
              <ContactUs />
            </div>
          </div>
        </section>
        <section id="fetuers" styleName="fetuers">
          <div className="row">
            <div className="large-12 columns">
              <h2 styleName="fet_ttl_main" >{t('home.opportunities')}</h2>
              <p styleName="sub_ttl">
                {t('home.opportunitiesSub')}
              </p>
            </div>
          </div>

          <div className="row">
            {this.opportunities && this.opportunities.length > 0 &&
              this.opportunities.map((opportunity, index) =>
                <Opportunity
                  key={index}
                  title={opportunity.title}
                  desc={opportunity.text}
                  imgSrc={opportunity.image}
                />)}
          </div>
        </section>

        <section id="testemonials" styleName="testemonials-wrapper">
          <div className="row">
            <div className="large-12 columns">
              <h2 styleName="tes-title" >{t('home.testemonials')}:</h2>
            </div>
          </div>
          <div className="row">
            {this.testemonials && this.testemonials.length > 0 &&
              this.testemonials.map((testemonial, index) =>
                <Testemonial
                  key={index}
                  name={testemonial.title}
                  desc={testemonial.text}
                />)
            }
          </div>
        </section>

        <section id="tenders" styleName="tenders">

          <div className="row">
            <div className="large-12 columns">
              <h2 styleName="tenders-title" >{t('home.lastTenders')}</h2>
            </div>
          </div>

          <div className="row">
            <div className="large-12 columns">
              {
                homeStore.sampleTenders.map(tender =>
                  <TenderItem
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

        <section className="banner show-for-medium">
        	<div className="row">
        		<div className="large-12 columns">
              <Link to="/publish">
        			   <img src="https://www.tenders.co.il/images/home/banner.png" alt="" />
              </Link>
        		</div>
        	</div>
        </section>

        <section id="news" styleName="news">
          <div className="row">
            <div className="large-12 columns">
              <h2 >&nbsp;</h2>
            </div>
          </div>

          <div className="row">
            <div className="large-12 columns">
              <h2 styleName="acticles-title" >{t('home.articles')}</h2>
            </div>
          </div>

          <div className="row">
            {this.articles && this.articles.length > 0 &&
              this.articles.map((article, index) =>
                <Article
                  key={index}
                  articleID={article.articleID}
                  title={article.title}
                  imgSrc={article.image}
                />)
            }

            <div className="large-12 columns">
              <Link to="/articles" styleName="more">{t('home.allArticles')}</Link>
            </div>
          </div>

        </section>


        <section id="videos" styleName="videos">
          <div className="row">
            <div className="large-12 columns">
              <h2 styleName="acticles-title">{t('home.movies')}</h2>
            </div>
          </div>

          <div className="row">
            {this.movies && this.movies.length > 0 &&
              this.movies.map((movie, index) =>
                <YouTubeTip
                  key={index}
                  title={movie.title}
                  thumbnail={movie.thumbnail}
                  url={movie.url}
                />)
            }
          </div>

        </section>
        <Footer />
        {/*<ContactAction />*/}
      </div>
    )
  }
}
