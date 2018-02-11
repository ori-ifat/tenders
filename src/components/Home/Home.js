import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import SearchInput from 'common/components/SearchInput'
import CatItem from './Items/CatItem'
import SubCatItem from './Items/SubCatItem'
import ContactUs from './ContactUs'
import Opportunity from './Items/Opportunity'
import Testemonial from './Items/Testemonial'
import Tender from './Items/Tender'
import Article from './Items/Article'
import Footer from 'common/components/Footer'
import Loading from 'common/components/Loading/Loading'
import moment from 'moment'
import {getHomeJSON} from 'common/services/apiService'
import {getMetaData} from 'common/utils/meta'
import DocumentMeta from 'react-document-meta'
import CSSModules from 'react-css-modules'
import styles from './home.scss'
import 'common/style/home.css'

@translate()
@inject('homeStore')
@CSSModules(styles, {allowMultiple: true})
@observer
export default class Home extends Component {

  @observable allCats = false
  @observable opportunities = [];
  @observable testemonial1;
  @observable testemonial2;
  @observable testemonial3;
  @observable article1;
  @observable article2;
  @observable article3;

  componentWillMount() {
    const {homeStore} = this.props
    homeStore.loadCatResults().then(() => {
      homeStore.loadSubCatResults()
    })
    homeStore.loadSampleTenders()
    //json data for hard-coded stuff:
    getHomeJSON('Articles', 'article-preview1').then(res => {
      this.article1 = res
    })
    getHomeJSON('Articles', 'article-preview2').then(res => {
      this.article2 = res
    })
    getHomeJSON('Articles', 'article-preview3').then(res => {
      this.article3 = res
    })
    getHomeJSON('Opportunities', 'opportunities').then(res => {
      this.opportunities = res
    })
    getHomeJSON('Testemonials', 'testemonial1').then(res => {
      this.testemonial1 = res
    })
    getHomeJSON('Testemonials', 'testemonial2').then(res => {
      this.testemonial2 = res
    })
    getHomeJSON('Testemonials', 'testemonial3').then(res => {
      this.testemonial3 = res
    })
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
            {this.testemonial1 && <Testemonial
              name={this.testemonial1.title}
              desc={this.testemonial1.text}
            />}
            {this.testemonial2 && <Testemonial
              name={this.testemonial2.title}
              desc={this.testemonial2.text}
            />}
            {this.testemonial3 && <Testemonial
              name={this.testemonial3.title}
              desc={this.testemonial3.text}
            />}
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
                  <Tender
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
              <a href="#/publish">
        			<img src="http://www.tenders.co.il/front/img/stupid.png" alt="" /></a>
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

            {this.article1 && <Article
              articleID={this.article1.articleID}
              title={this.article1.title}
              imgSrc={this.article1.image}
            />}

            {this.article2 && <Article
              articleID={this.article2.articleID}
              title={this.article2.title}
              imgSrc={this.article2.image}
            />}

            {this.article3 && <Article
              articleID={this.article3.articleID}
              title={this.article3.title}
              imgSrc={this.article3.image}
            />}

            <div className="large-12 columns">
              <a href="#/articles" styleName="more">{t('home.allArticles')}</a>
            </div>
          </div>

        </section>
        <Footer />
      </div>
    )
  }
}
