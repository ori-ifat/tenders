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
//import {randomNumber} from 'common/utils/util'
//import ContactAction from 'common/components/ContactAction'
import CSSModules from 'react-css-modules'
import styles from './home.scss'
import 'common/style/home.css'

/*const req = require.context('common/style/icons/', false)
const videos_1 = req('./video_1.jpg')
const videos_2 = req('./video_2.jpg')
const videos_3 = req('./video_3.jpg')*/

@translate()
@inject('homeStore')
@CSSModules(styles)
@observer
export default class Home extends Component {

  @observable allCats = false
  @observable opportunities = []
  //@observable testemonial1;
  //@observable testemonial2;
  //@observable testemonial3;
  @observable testemonials = []
  //@observable article1;
  //@observable article2;
  //@observable article3;
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
    /*getHomeJSON('Articles', 'article-preview1', cache).then(res => {
      this.article1 = res
    })
    getHomeJSON('Articles', 'article-preview2', cache).then(res => {
      this.article2 = res
    })
    getHomeJSON('Articles', 'article-preview3', cache).then(res => {
      this.article3 = res
    })*/
    getHomeJSON('Articles', 'articles-preview', cache).then(res => {
      this.articles = res
    })
    getHomeJSON('Opportunities', 'opportunities').then(res => {
      this.opportunities = res
    })
    /*getHomeJSON('Testemonials', 'testemonial1').then(res => {
      this.testemonial1 = res
    })
    getHomeJSON('Testemonials', 'testemonial2').then(res => {
      this.testemonial2 = res
    })
    getHomeJSON('Testemonials', 'testemonial3').then(res => {
      this.testemonial3 = res
    })*/
    getHomeJSON('Testemonials', 'testemonials').then(res => {
      this.testemonials = res
    })
    getHomeJSON('Movies', 'movies').then(res => {
      this.movies = res
    })
    fixTopMenu()
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
            {/*this.testemonial1 && <Testemonial
              name={this.testemonial1.title}
              desc={this.testemonial1.text}
            />*/}
            {/*this.testemonial2 && <Testemonial
              name={this.testemonial2.title}
              desc={this.testemonial2.text}
            />*/}
            {/*this.testemonial3 && <Testemonial
              name={this.testemonial3.title}
              desc={this.testemonial3.text}
            />*/}
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

            {/*this.article1 && <Article
              articleID={this.article1.articleID}
              title={this.article1.title}
              imgSrc={this.article1.image}
            />*/}

            {/*this.article2 && <Article
              articleID={this.article2.articleID}
              title={this.article2.title}
              imgSrc={this.article2.image}
            />*/}

            {/*this.article3 && <Article
              articleID={this.article3.articleID}
              title={this.article3.title}
              imgSrc={this.article3.image}
            />*/}
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
            {/*<div className="large-4 columns">
              <a href="https://www.youtube.com/watch?v=Zo6f6rQfFS4" target="_blank">
                <img src={videos_1} />
                <h3>{t('home.movie1')}</h3>
              </a>
            </div>

            <div className="large-4 columns">
              <a href="https://www.youtube.com/watch?v=2xDpfiqn1ig" target="_blank">
                <img src={videos_2} />
                <h3>{t('home.movie2')}</h3>
              </a>
            </div>

            <div className="large-4 columns">
              <a href="https://www.youtube.com/watch?v=1HCso90x494" target="_blank">
                <img src={videos_3} />
                <h3>{t('home.movie3')}</h3>
              </a>
            </div>*/}
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
