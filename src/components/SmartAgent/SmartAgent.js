import React, {Component} from 'react'
import { inject, observer } from 'mobx-react'
import { observable, toJS} from 'mobx'
import {translate} from 'react-polyglot'
import moment from 'moment'
import remove from 'lodash/remove'
import find from 'lodash/find'
import SearchInput from 'common/components/SearchInput'
import {checkEmail, checkPhone} from 'common/utils/validation'
import {publishTender, clearCache} from 'common/services/apiService'
import Definition from './Definition'
import NotLogged from 'common/components/NotLogged'
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
  @observable email = ''
  @observable phone = ''
  @observable frequencies = []
  @observable tendertypes = []
  @observable queries = []
  @observable contacts = []

  componentWillMount() {
    const {smartAgentStore} = this.props
    smartAgentStore.loadAgentSettings().then(() => {
      this.frequencies = smartAgentStore.results.Frequencies.filter(frequency => frequency.FrequencySelected == 1)
      this.tendertypes = smartAgentStore.results.TenderTypes.filter(tendertype => tendertype.TenderTypeSelected == 1)
      this.queries = smartAgentStore.results.Queries
      this.contacts = smartAgentStore.results.Contacts
      this.email = smartAgentStore.results.Contacts[0].Email
      this.phone = smartAgentStore.results.Contacts[0].Cellular
    })
    smartAgentStore.loadSubSubjects()
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
    console.log(toJS(this.frequencies))
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
    //console.log(toJS(this.queries))
  }

  onSave = () => {
    const {smartAgentStore, t} = this.props
    this.sent = false
    this.status = ''
    let errors = ''
    if (this.email == '' && this.phone == '') {
      errors += `${t('agent.enterEmailOrPhone')}; `
    }
    else if (!checkEmail(this.email, true)) {
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
      console.log(data)
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
      return current.SubsubjectID == query.SubsubjectID &&
        current.SearchWords == query.SearchWords
    })

    if (found) {
      remove(this.queries, current => {
        return current.SubsubjectID == query.SubsubjectID &&
          current.SearchWords == query.SearchWords
      })
    }
    //console.log(toJS(this.queries))
  }

  onError = (isDuplicate) => {
    const {t} = this.props
    if (!isDuplicate) {
      this.status = t('agent.cannotSaveDefinition')
    }
    else {
      this.status = t('agent.duplicateDefinition')
    }
  }

  render() {
    const {accountStore: {profile}, smartAgentStore: {resultsLoading, results, query}, t} = this.props
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
            {profile ?
              <div styleName="wrapper">
                {this.status != '' &&
                <div className="callout alert" styleName={style}>
                  <p styleName={style} dangerouslySetInnerHTML={{__html: this.status}}></p>
                </div>
                }
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
                        defaultValue={results.Contacts[0].Email}
                      />
                      <span>{t('agent.phone')}:</span>
                      <input type="text"
                        name="phone"
                        styleName="input-value"
                        onChange={this.onInputChange}
                        defaultValue={results.Contacts[0].Cellular}
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

                      {results.Queries.map((query, index) =>
                        <Definition
                          key={index}
                          query={query}
                          allQueries={toJS(this.queries)}
                          onError={this.onError}
                          onSave={this.onQuerySave}
                          onDelete={this.onDelete}
                        />)
                      }
                      <Definition
                        isNew={true}
                        query={null}
                        allQueries={toJS(this.queries)}
                        onError={this.onError}
                        onSave={this.onQuerySave}
                        onDelete={this.onDelete}
                      />
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

                  <div styleName="btn_container">
                    <button className="left" styleName="button-submit" onClick={this.onSave}>{t('agent.submit')}</button>
                  </div>
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
