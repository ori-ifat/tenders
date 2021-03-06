import React, {Component} from 'react'
import { inject, observer } from 'mobx-react'
import { observable, toJS} from 'mobx'
import {translate} from 'react-polyglot'
import moment from 'moment'
import remove from 'lodash/remove'
import find from 'lodash/find'
import sortBy from 'lodash/sortBy'
import SearchInput from 'common/components/SearchInput'
import {checkEmail, checkPhone} from 'common/utils/validation'
import {publishTender, clearCache} from 'common/services/apiService'
import Definition from './Definition'
import NotLogged from 'common/components/NotLogged'
import ReactTooltip from 'react-tooltip'
import CSSModules from 'react-css-modules'
import styles from './smartAgent.scss'

const req = require.context('common/style/icons/', false)

@translate()
@inject('accountStore')
@inject('smartAgentStore')
@observer
@CSSModules(styles)
export default class SmartAgent extends Component {

  @observable sent = false
  @observable status = ''
  @observable definitionError = false
  @observable email = ''
  @observable phone = ''
  @observable frequencies = []
  @observable tendertypes = []
  @observable queries = []
  @observable contacts = []
  @observable word = ''
  @observable compareTo = ''

  componentWillMount() {
    const {smartAgentStore, showNotification} = this.props
    smartAgentStore.loadAgentSettings().then(() => {
      this.frequencies = smartAgentStore.results.Frequencies.filter(frequency => frequency.FrequencySelected == 1)
      this.tendertypes = smartAgentStore.results.TenderTypes.filter(tendertype => tendertype.TenderTypeSelected == 1)
      this.queries = smartAgentStore.results.Queries
      this.contacts = smartAgentStore.results.Contacts
      this.email = smartAgentStore.results.Contacts.length > 0 ? smartAgentStore.results.Contacts[0].Email : ''
      this.phone = smartAgentStore.results.Contacts.length > 0 ? smartAgentStore.results.Contacts[0].Cellular : ''
    })
    smartAgentStore.loadSubSubjects()
    smartAgentStore.checkUser()
    showNotification(true)
  }

  onInputChange = e => {
    switch (e.target.name) {
    case 'email':
      this.email = e.target.value
      break
    case 'phone':
      this.phone = e.target.value
      break
    }
    //console.log(this.email, this.phone)
  }

  onRadioCheck = e => {
    this.frequencies.clear()
    const val = e.target.value.split('_')
    this.frequencies.push({
      FrequencyID: parseInt(val[0]),
      FrequencyName: val[1],
      FrequencySelected: 1
    })
    //console.log(toJS(this.frequencies))
  }

  onCheck = e => {
    if(e.target.checked){
      const found = find(this.tendertypes, tendertype => {
        return tendertype.TenderTypeID === parseInt(e.target.value)
      })
      if (!found) {
        this.tendertypes.push({
          TenderTypeID: parseInt(e.target.value),
          TenderTypeName: e.target.name,
          TenderTypeSelected: 1
        })
      }
    }
    else {
      remove(this.tendertypes, tendertype => {
        return tendertype.TenderTypeID === parseInt(e.target.value)
      })
    }
    //console.log(toJS(this.tendertypes))
  }

  onQuerySave = (query, newQuery) => {
    if (query) this.onDelete(query)
    this.queries.push(newQuery)
    this.queries = sortBy(this.queries, query => {
      //return query.SubsubjectID
      return query.SubSubjectName
    })
    //console.log(toJS(this.queries))
  }

  onSave = () => {
    const {smartAgentStore, t} = this.props
    this.sent = false
    this.status = ''
    this.definitionError = false
    let errors = ''
    /*  //allow save without mail or phone
    if (this.email == '' && this.phone == '') {
      errors += `${t('agent.enterEmailOrPhone')}; `
    }*/
    if (!checkEmail(this.email, true)) {
      errors += `${t('agent.emailNotValid')}; `
    }
    else if (!checkPhone(this.phone, true)) {
      errors += `${t('agent.phoneNotValid')}; `
    }

    if (errors != '') {
      this.status = errors
    }
    else {
      //send data
      const data = {
        Subsubjects: toJS(this.queries),
        Tenders_Type: toJS(this.tendertypes),
        frequencies: toJS(this.frequencies),
        Cellulars: toJS(this.phone) || '',
        Emails: toJS(this.email) || ''
      }
      //console.log(data)
      smartAgentStore.updateSettings(data)
        .then(res => {
          //show a message
          clearCache()
          this.sent = true
          this.status = t('agent.sentSuccessfully')
          console.log(res, this.sent, this.status)
        })
    }
  }

  onDelete = (query) => {
    const found = find(this.queries, current => {
      return current.SubsubjectID == query.SubsubjectID
      //&& current.SearchWords == query.SearchWords
    })

    if (found) {
      remove(this.queries, current => {
        return current.SubsubjectID == query.SubsubjectID
        //&& current.SearchWords == query.SearchWords
      })
    }
    //console.log(toJS(this.queries))
  }

  onError = (isDuplicate) => {
    const {t} = this.props
    //init:
    this.sent = false
    this.status = ''
    this.definitionError = true
    if (!isDuplicate) {
      this.status = t('agent.cannotSaveDefinition')
    }
    else {
      this.status = t('agent.duplicateDefinition')
    }
  }

  clearErrors = () => {
    this.sent = false
    this.status = ''
  }

  checkCounts = () => {
    const {smartAgentStore} = this.props
    const data = {
      Subsubjects: toJS(this.queries),
      Tenders_Type: toJS(this.tendertypes),
      frequencies: toJS(this.frequencies),
      Cellulars: toJS(this.phone) || '',
      Emails: toJS(this.email) || ''
    }
    //console.log(data)
    smartAgentStore.checkEstimation(data) /*
      .then(res => {
        //show a message
        this.estimationCount = res
      })*/
  }

  updateField = e => {
    e.target.name == 'word' ? this.word = e.target.value : this.compareTo = e.target.value
  }

  compareText = () => {
    const {smartAgentStore} = this.props
    smartAgentStore.compareText(this.word, this.compareTo)
  }

  render() {
    const {accountStore: {profile}, smartAgentStore: {resultsLoading, results, query, ifatUser, estimatedCount, text}, t} = this.props
    const style = this.sent ? 'sent' : 'errors'
    const defaultEmail = results && results.Contacts && results.Contacts.length > 0 ? results.Contacts[0].Email : ''
    const defaultPhone = results && results.Contacts && results.Contacts.length > 0 ? results.Contacts[0].Cellular : ''
    const toolTipData = ifatUser.ifat ? '' : t('agent.readOnly')
    return (
      <div>
        <div styleName="search-div" >
          <SearchInput />
        </div>
        <div className="row" styleName="title-container">
          <div className="column large-12">
            <h1 styleName="title" data-tip={toolTipData}>{t('agent.title')}</h1>
          </div>
        </div>
        <div className="row">
          <div className="column large-12">
            {profile ?
              <div styleName="wrapper">
                {!resultsLoading &&
                <div>
                  <div className="grid-x">
                    <div styleName="ttl_container" className="medium-3 cell">
                      <h4>{t('agent.reminderTime')}</h4>
                    </div>
                    <div styleName="agent_content" className="medium-9 cell">
                      {results.Frequencies.map((frequency, index) =>
                        <div key={index}>
                          <input type="radio"
                            name="Frequencies"
                            value={`${frequency.FrequencyID}_${frequency.FrequencyName}`}
                            defaultChecked={frequency.FrequencySelected}
                            onClick={this.onRadioCheck}
                          />
                          {frequency.FrequencyName}
                        </div>)
                      }
                    </div>
                  </div>

                  <div className="grid-x">
                    <div styleName="ttl_container" className="medium-3 cell">
                      <h4>{t('agent.destination')}</h4>
                    </div>
                    <div styleName="agent_content" className="medium-9 cell">
                      <span>{t('agent.email')}:</span>
                      <input type="email"
                        name="email"
                        styleName="input-value"
                        onChange={this.onInputChange}
                        defaultValue={defaultEmail}
                      />
                      <span>{t('agent.phone')}:</span>
                      <input type="text"
                        name="phone"
                        styleName="input-value"
                        onChange={this.onInputChange}
                        defaultValue={defaultPhone}
                      />
                    </div>
                  </div>

                  <div className="grid-x">
                    <div styleName="ttl_container" className="medium-3 cell">
                      <h4>{t('agent.queries')}</h4>
                    </div>

                    <div styleName="queryies" className="medium-9 cell" >
                      <div className="grid-x">
                        <div className="medium-3 cell">
                          <h4>{t('agent.branch')}</h4>
                        </div>
                        <div className="medium-9 cell">
                          <h4>{t('agent.words')}</h4>
                        </div>
                      </div>

                      {this.queries.map((query, index) =>
                        <Definition
                          key={index}
                          query={query}
                          allQueries={toJS(this.queries)}
                          onError={this.onError}
                          onSave={this.onQuerySave}
                          onDelete={this.onDelete}
                          onClear={this.clearErrors}
                        />)
                      }
                      <Definition
                        isNew={true}
                        query={null}
                        allQueries={toJS(this.queries)}
                        onError={this.onError}
                        onSave={this.onQuerySave}
                        onDelete={this.onDelete}
                        onClear={this.clearErrors}
                      />
                      {this.status != '' && this.definitionError &&
                        <div className="callout alert" styleName={style} style={{width: '100%'}}>
                          <p styleName={style} dangerouslySetInnerHTML={{__html: this.status}}></p>
                        </div>
                      }
                    </div>
                  </div>

                  <div className="grid-x">
                    <div styleName="ttl_container" className="medium-3 cell">
                      <h4>{t('agent.infoTypes')}</h4>
                    </div>

                    <div styleName="agent_content" className="medium-9 cell">
                      {results.TenderTypes.map((tendertype, index) =>
                        <div key={index}>
                          <input type="checkbox"
                            className="checkbox_tender"
                            name={tendertype.TenderTypeName}
                            defaultChecked={tendertype.TenderTypeSelected}
                            value={tendertype.TenderTypeID}
                            onChange={this.onCheck}
                          />
                          <span styleName="cb-label">{tendertype.TenderTypeName}</span>
                        </div>)
                      }
                    </div>
                  </div>
                  {ifatUser.ifat &&
                    <div className="grid-x">
                      <div styleName="ttl_container" className="medium-3 cell">
                        <h4>{t('agent.estimate')}</h4>
                      </div>

                      <div styleName="agent_content" className="medium-9 cell">
                        <button className="left" styleName="button-submit" onClick={this.checkCounts}>{t('agent.submitCounts')}</button>
                        {estimatedCount > -1 && <div styleName="estimation">{t('agent.estimatedCount', {estimatedCount})}</div>}
                      </div>
                    </div>
                  }
                  {ifatUser.ifat &&
                    <div className="grid-x">
                      <div styleName="ttl_container" className="medium-3 cell">
                        <h4>{t('agent.checkWords')}</h4>
                      </div>

                      <div styleName="agent_content" className="medium-9 cell">
                        {t('agent.word')}<input type="text" name="word" onChange={this.updateField} />
                        {t('agent.compareTo')}<textarea name="compare" onChange={this.updateField} />
                        <button className="left" styleName="button-submit" onClick={this.compareText}>{t('agent.submitText')}</button>
                        {text != '' && <div styleName="text-compare" dangerouslySetInnerHTML={{__html: text}}></div>}
                      </div>
                    </div>
                  }
                  {ifatUser.ifat &&
                    <div styleName="btn_container">
                      {this.status != '' &&
                        <div className="callout alert" styleName={style}>
                          <p styleName={style} dangerouslySetInnerHTML={{__html: this.status}}></p>
                        </div>
                      }
                      <button className="left" styleName="button-submit" onClick={this.onSave}>{t('agent.submit')}</button>
                    </div>
                  }
                  {!ifatUser.ifat && <div styleName="block"></div>}
                  <ReactTooltip />
                </div>
                }
              </div>
              :
              <NotLogged />
            }
          </div>
        </div>
      </div>
    )
  }
}
