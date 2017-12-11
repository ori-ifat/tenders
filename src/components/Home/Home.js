import React, {Component} from 'react'
import SearchInput from 'common/components/SearchInput'
import {inject, observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import CatItem from './Items/CatItem'
import SubCatItem from './Items/SubCatItem'
import Opportunity from './Items/Opportunity'
import Testemonial from './Items/Testemonial'
import Tender from './Items/Tender'
import Article from './Items/Article'
import CSSModules from 'react-css-modules'
import styles from './home.scss'
import 'common/style/home.css'

const req = require.context('common/style/icons/', false)
//const food = req('./Food.svg')
const mobile = req('./mobile.svg')

@translate()
@inject('homeStore')
@CSSModules(styles)
@observer
export default class Home extends Component {

  @observable allCats = false

  componentWillMount() {
    const {homeStore} = this.props
    homeStore.loadCatResults().then(() => {
      homeStore.loadSubCatResults()
    })
  }

  showAllCats = () => {
    this.allCats = !this.allCats
  }

  render() {
    const {homeStore, homeStore: {resultsLoading},  t} = this.props
    const catStyle = this.allCats ? '' : 'hide'
    const catLabel = this.allCats ? t('home.hideAllCat') : t('home.showAllCat')
    return (
      <div>
        <section styleName="hero">
          <div className="row">
            <div className="columns large-12">
              <h1 styleName="hero_txt">{t('home.mainTitle')} <br /> {t('home.mainTitle2')}!</h1>
              <p styleName="sub_head">{t('home.subTitle')}</p>
            </div>
          </div>
          <div className="row">
            <div className="column large-12">
              <SearchInput />
            </div>
          </div>
        </section>
        <div className="row bg">&nbsp;</div>
        <section id="categories">
          <div className="row">
            <div className="large-12 columns">
              <h2 styleName="cat-title" >{t('home.catTitle')}</h2>
              <div className="row collapse small-up-1 medium-up-2 large-up-4">
              {resultsLoading && <div>Loading...</div>}
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

        <section id="fetuers" styleName="fetuers">
          <div className="row">
            <div className="large-12 columns">
              <h2 styleName="fet_ttl_main" >{t('home.opportunities')}</h2>
            </div>
          </div>

          <div className="row">

            <Opportunity
              title="App"
              desc="some titled description"
              imgSrc={mobile}
            />
          </div>
        </section>

        <section id="testemonials" styleName="testemonials-wrapper">
          <div className="row">
            <div className="large-12 columns">
              <h2 styleName="tes-title" >{t('home.testemonials')}:</h2>
            </div>
          </div>
          <div className="row">

            <Testemonial
              name="moses, shim technologies"
              desc="some more data"
            />
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

              <Tender
                date="11/11/11"
                title="test11"
                desc="some long title"
              />

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

          <Article
            articleID="999"
            title="article-1111"
            imgSrc="http://www.tenders.co.il/front/img/art7_home.jpg"
          />

          <div className="large-12 columns">
            <a href="#/articles" styleName="more">{t('home.allArticles')}</a>
          </div>
        </div>

      </section>

      <footer styleName="footer">
        <div className="row">
          <div className="medium-6 columns">
            <p>{t('home.rights')}</p>
          </div>

          <div className="medium-6 columns">
            <p className="medium-text-left">{t('home.service')}</p>
          </div>
        </div>
      </footer>

      </div>
    )
  }
}
