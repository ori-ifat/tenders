import React, {Component} from 'react'
import { withRouter } from 'react-router'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import {translate} from 'react-polyglot'
import moment from 'moment'
import SearchInput from 'common/components/SearchInput'
import {publishTender} from 'common/services/apiService'
import Definition from './Definition'
import CSSModules from 'react-css-modules'
import styles from './smartAgent.scss'

const req = require.context('common/style/icons/', false)

@translate()
@withRouter
@observer
@CSSModules(styles)
export default class SmartAgent extends Component {

  @observable sent = false
  @observable status = ''
  @observable email = ''
  @observable phone = ''
  @observable edit = false

  componentWillMount() {
    //const { match: {params: { itemId }} } = this.props
  }


  onChange = e => {
    switch (e.target.name) {
    case 'email':
      this.email = e.target.value
      break
    case 'phone':
      this.phone = e.target.value
      break
    }
  }

  onSave = () => {
    const {t} = this.props
    this.sent = false
    this.status = ''
    let errors = ''
    if (this.email == '') {
      errors += `${t('publish.enterEmail')}; `
    }
    if (this.phone == '') {
      errors += `${t('publish.enterPhone')}; `
    }

    if (errors != '') {
      this.status = errors
    }
    else {
      //send data
      /*f().then(res => {
        //show a message
        this.sent = true
        this.status = t('publish.sentSuccessfully')
        console.log(res, this.sent, this.status)
      })*/
    }
  }

  onCheck = e => {
    console.log(e.target.checked)
    if (e.target.checked) {

    }
    else {

    }
  }

  editItem = () => {
    this.edit = !this.edit  //debug
  }

  render() {
    const {t} = this.props
    const style = this.sent ? 'sent' : 'errors'
    return (
      <div>
        <div styleName="search-div" >
          <SearchInput />
        </div>
        <div className="row" styleName="title-container">
          <div className="column large-12">
            <h1 styleName="title">{t('agent.title')}</h1>
          </div>
        </div>

        <div className="row">
          <div className="column large-12">
            <div styleName="wrapper">
              {this.status != '' &&
              <div className="callout alert" styleName={style}>
                <p styleName={style} dangerouslySetInnerHTML={{__html: this.status}}></p>
              </div>
              }

              <div className="grid-x">
                <div className="medium-3 cell">
                  {t('agent.reminderTime')}
                </div>
                <div className="medium-9 cell">
                  <input type='radio' name="sendTime" />{t('agent.immediately')} <br />
                  <input type='radio' name="sendTime" />{t('agent.daily')}
                </div>
              </div>

              <div className="grid-x">
                <div className="medium-3 cell">
                  {t('agent.destination')}
                </div>
                <div className="medium-9 cell">
                  <span>{t('agent.email')}:</span>
                  <input type="email" name="email" styleName="input-value" onChange={this.onChange} />
                  <span>{t('agent.phone')}:</span>
                  <input type="text" name="phone" styleName="input-value" onChange={this.onChange} />
                </div>
              </div>

              <div className="grid-x">
                <div className="medium-3 cell">
                  {t('agent.queries')}
                </div>
                <div className="medium-9 cell">
                  <div className="grid-x">
                    <div className="medium-3 cell">
                      {t('agent.branch')}
                    </div>
                    <div className="medium-6 cell">
                      {t('agent.words')}
                    </div>
                  </div>

                  <div className="grid-x">
                    <div className="medium-3 cell" onClick={this.editItem}>
                      test
                    </div>
                    <div className="medium-6 cell">
                      words
                    </div>
                  </div>

                  {this.edit && <Definition onClose={this.editItem} />}

                </div>
              </div>

              <div className="grid-x">
                <div className="medium-3 cell">
                  {t('agent.infoTypes')}
                </div>
                <div className="medium-9 cell">

                  <input type="checkbox"
                    className="checkbox_tender"
                    checked={true}
                    name="test"
                    value="1"
                    onChange={this.onCheck}
                  />
                  <span styleName="cb-label">test</span>
                </div>
              </div>

              <div styleName="btn_container">
                <button className="left" styleName="button-submit" onClick={this.onSave}>{t('agent.submit')}</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}
