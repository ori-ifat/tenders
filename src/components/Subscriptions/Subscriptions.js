import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {translate} from 'react-polyglot'
import Footer from 'common/components/Footer'
import CSSModules from 'react-css-modules'
import styles from './subscriptions.scss'

@translate()
@CSSModules(styles, {allowMultiple: true})
@observer
export default class Subscriptions extends Component {

  @observable oneCatPartial = false
  @observable twoCatPartial = false
  @observable allCatPartial = false

  componentWillMount() {
    const {showNotification} = this.props
    showNotification(true)
  }

  showPartial = type => {
    switch (type) {
    case 'onecat':
      this.oneCatPartial = !this.oneCatPartial
      break
    case 'twocat':
      this.twoCatPartial = !this.twoCatPartial
      break
    case 'allcat':
      this.allCatPartial = !this.allCatPartial
      break
    default:

    }
  }

  render() {
    const {t} = this.props
    const oneCatPrice = this.oneCatPartial ? 155 : 129
    const twoCatPrice = this.twoCatPartial ? 190 : 159
    const allCatPrice = this.allCatPartial ? 290 : 240

    const oneCatLabel = this.oneCatPartial ? t('subscriptions.catConditionPartial') : t('subscriptions.catCondition')
    const oneCatLinkLabel = this.oneCatPartial ? t('subscriptions.showFull') : t('subscriptions.showPartial')

    const twoCatLabel = this.twoCatPartial ? t('subscriptions.catConditionPartial') : t('subscriptions.catCondition')
    const twoCatLinkLabel = this.twoCatPartial ? t('subscriptions.showFull') : t('subscriptions.showPartial')

    const allCatLabel = this.allCatPartial ? t('subscriptions.catConditionPartial') : t('subscriptions.catCondition')
    const allCatLinkLabel = this.allCatPartial ? t('subscriptions.showFull') : t('subscriptions.showPartial')

    return (
      <div>
        <div className="row" >

          <div className="large-12 columns" >
            <h1 styleName="main_ttl" >{t('subscriptions.title')}</h1>
            <hr styleName="divider" />
          </div>

        </div>
        <section styleName="pricing">
          <div className="row" >
            <div className="large-12 columns" >
              <div className="row collapse" >

                <div className="medium-4 columns" >
                  <div styleName="plan" >
                    <h2>{t('subscriptions.onecat')}</h2>

                    <div styleName="top_info" >
                      <p styleName="price"><span styleName="p_big">{oneCatPrice}</span> {t('subscriptions.catPrice')}</p>
                      <p className="text-center" >{oneCatLabel}</p>
                      <a styleName="show_full" onClick={() => this.showPartial('onecat')} >{oneCatLinkLabel}</a>
                    </div>

                    <div styleName="bottom_info" >
                      <p>{t('subscriptions.benefit1')}</p>
                      <p>{t('subscriptions.benefit2')}</p>
                      <p>{t('subscriptions.benefit3')}</p>
                      <p>{t('subscriptions.benefit4')}</p>
                      <p>{t('subscriptions.benefit5')}</p>
                      <p>{t('subscriptions.benefit6')}</p>
                      <p>{t('subscriptions.benefit7')}</p>
                      <p>{t('subscriptions.benefit8')}</p>
                    </div>
                    <p className="text-center">
                      <a className="button" styleName="signup_btn" href="">לֹהרשמה</a>
                    </p>

                  </div>
                </div>

                <div className="medium-4 columns" >
                  <div styleName="plan" >
                    <h2>{t('subscriptions.twocat')}</h2>

                    <div styleName="top_info" >
                      <p styleName="price"><span styleName="p_big" >{twoCatPrice}</span> {t('subscriptions.catPrice')}</p>
                      <p className="text-center" >{twoCatLabel}</p>
                      <a styleName="show_full" onClick={() => this.showPartial('twocat')} >{twoCatLinkLabel}</a>
                    </div>

                    <div styleName="bottom_info" >
                      <p>{t('subscriptions.benefit1')}</p>
                      <p>{t('subscriptions.benefit2')}</p>
                      <p>{t('subscriptions.benefit3')}</p>
                      <p>{t('subscriptions.benefit4')}</p>
                      <p>{t('subscriptions.benefit5')}</p>
                      <p>{t('subscriptions.benefit6')}</p>
                      <p>{t('subscriptions.benefit7')}</p>
                      <p>{t('subscriptions.benefit8')}</p>
                    </div>
                    <p className="text-center">
                      <a className="button" styleName="signup_btn" href="">לֹהרשמה</a>
                    </p>

                  </div>
                </div>

                <div className="medium-4 columns" >
                  <div styleName="plan hilight" >
                    <h2>{t('subscriptions.allcat')}</h2>

                    <div styleName="top_info" >
                      <p styleName="price"><span styleName="p_big">{allCatPrice}</span> {t('subscriptions.catPrice')}</p>
                      <p className="text-center" >{allCatLabel}</p>
                      <a styleName="show_full" onClick={() => this.showPartial('allcat')} >{allCatLinkLabel}</a>
                    </div>

                    <div styleName="bottom_info" >
                      <p>{t('subscriptions.benefit1')}</p>
                      <p>{t('subscriptions.benefit2')}</p>
                      <p>{t('subscriptions.benefit3')}</p>
                      <p>{t('subscriptions.benefit4')}</p>
                      <p>{t('subscriptions.benefit5')}</p>
                      <p>{t('subscriptions.benefit6')}</p>
                      <p>{t('subscriptions.benefit7')}</p>
                      <p>{t('subscriptions.benefit8')}</p>
                    </div>
                    <p className="text-center">
                      <a className="button" styleName="signup_btn" href="">לֹהרשמה</a>
                    </p>

                  </div>
                </div>
              </div>
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
