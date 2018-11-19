import 'whatwg-fetch'
import cache from 'common/utils/cache'
//import {notifyMessage} from 'common/utils/notifications'

let apiBaseUrl
let baseUrl
if (process.env.NODE_ENV === 'development' || location.href.indexOf('iis-test') > -1) {
  apiBaseUrl = '//iis-test:8081/Data/api'
  baseUrl = '//iis-test:8081/Data'
  //apiBaseUrl = 'http://192.118.60.25/TendersDevApi/api'
  //baseUrl = 'http://192.118.60.25/TendersDevApi'
}
else {
  apiBaseUrl = '//www.tenders.co.il/Data/api'
  baseUrl = '//www.tenders.co.il/Data'
}

/// important notes for POST (added by ori):
/// 1. need to create an equivalent object on javascript, to the api request parameter;
/// 2. on POST, need to add 'Content-Type: application/json' header to request;
/// 3. when posting, add to the request body the above json object stringified, WITHOUT A NAME.
export function apiFetch(relUrl, {body, method, searchParams = {}} = {}, noCache) {
  const url = createUrl(relUrl, searchParams)

  const headers = new Headers()
  //headers.append('Accept', 'application/json') headers.append('Content-Type', 'application/json')



  //return on next tick, letting  mobx show loading indicator
  if (cache.has(url) && !noCache) {
    return new Promise((resolve) => setTimeout(() => resolve(cache.get(url)), 0))
  }

  //use credentials: 'include' to allow cookies to pass over cross-origin. needed for login data
  const options = {
    method: method || (body ? 'POST' : 'GET'),
    headers,
    body: body && JSON.stringify(body),
    credentials: 'include'
  }

  if (body) headers.append('Content-Type', 'application/json')

  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(response => {
        if (response.ok) {
          const json = response.json()
          cache.add(url, json.response || json)
          return resolve(json.response || json)
        }
        response.json()
          .then((message) => {
            //if (message.Message != 'Authorization has been denied for this request.')
            //notifyMessage(message.Message, 'error')

            return reject({ message: message.Message || message.error, error: response })
          })
          .catch(error => {
            console.error('apiFetch Error:', error)
            return reject({ message: error, error: response })
            //notifyMessage(error)
          })
      })
  })
}

export function createUrl(relUrl, searchParams = {}, isApi = true) {
  let url = `${ isApi ? apiBaseUrl : baseUrl }/${relUrl}`
  Object.keys(searchParams).forEach((key, index) => {
    if (index === 0) {
      url += '?'
    }
    if (index > 0) {
      url += '&'
    }
    //url += `${key}=${searchParams[key]}`
    const val = typeof searchParams[key] === 'string'
      ? searchParams[key]
      : JSON.stringify(searchParams[key])
    url += `${key}=${encodeURIComponent(val)}`
  })
  return url
}

export function clearCache() {
  cache.clear()
}

//TEST get data
export async function getData(id) {
  /*return Promise.resolve(
    [
      {TenderID: 1, InsertDate: '11/09/2016', Title: 'Rani rahav'},{TenderID: 2, InsertDate: '12/09/2016', Title: 'Rani rahav 2'}
    ]
  )*/
  return apiFetch('Tender/GetTop5', {searchParams: {InstalledProducID: id}})
}

export function autocomplete(query) {
  if (!query) {
    return new Promise((resolve) => resolve())
  }
  return apiFetch('Search/AutoComplete', {
    searchParams: {
      query
    }
  })
}

export async function search({tags, filters, page, pageSize, sort}) {

  const [filtersMeta, resultsPage] = await Promise.all([
    fetchFilters({ tags, filters, sort }),
    fetchResultsPage({ tags, filters, page, pageSize, sort })
  ])
  return { filtersMeta, resultsPage }
}

export async function fetchFilters({tags, filters, sort}) {
  return apiFetch('Search/GetFilters2', {
    searchParams: {
      tags, filters, sort
    }
  })
}

export async function fetchResultsPage({tags, filters, page, pageSize, sort}) {
  return apiFetch('Search/ResultPage2', {
    searchParams: {
      tags,
      page,
      pageSize,
      sort,
      filters
    }
  }).then(res => {
    return {
      total: res.info.count,
      page: res.info.page,
      data: res.data
    }
  })
}

export function me() {
  return apiFetch('Account/Me')
}

export function login(userName, password, rememberMe) {
  return apiFetch('Account/Login', {body: {userName, password, rememberMe}, method: 'POST' }, true)
}

export function logout() {
  return apiFetch('Account/Logout', {}, true)
}

export function validateAccount() {
  return apiFetch('Account/Validate', {}, true)
}

export function tokenLogin(token) {
  return apiFetch('Account/Login', {searchParams: { token }}, true)
}

export function isIfatUser() {
  return apiFetch('Account/IsIfat')
}

export async function getLastTenders(lastSeenTenderID) {
  return apiFetch('Tender/GetLastTenders', {searchParams: {
    LastSeenTenderID: lastSeenTenderID
  }}, true)
}

export async function getAgentResults({page, pageSize}) {
  return apiFetch('Agent/GetAgentResults', {
    searchParams: {
      page,
      pageSize
    }
  }).then(res => {
    return {
      total: res.info.count,
      page: res.info.page,
      data: res.data
    }
  })
}

export function getTender(tenderID) {
  return apiFetch('Tender/GetTender', {searchParams: {
    tenderID
  }})
}

export function getBanners() {
  return apiFetch('Lookup/GetBanners')
}

export async function getMoreTenders() {
  return apiFetch('Tender/GetTop5', {}, true)
}

export function addToFavorites(action, infoList) {
  return apiFetch('Favorites/AddRemoveFavorite', {searchParams: {
    Action: action,
    InfoList: infoList
  }}, true)
}

export function getEmailData(infoList) {
  return apiFetch('Email/EmailTo', {searchParams: {
    InfoList: infoList
  }}, true)
}

export function setReminder(action, reminderID, tenderID, remark, title, email, reminderDate) {
  //add more fields if needed, Ex. email, sms ...
  return apiFetch('Reminder/ReminderOptions', {searchParams: {
    ReminderID: reminderID,
    InfoID: tenderID,
    Remark: remark,
    Title: title,
    Sms: '',
    Email: email,
    ReminderDate: reminderDate,
    Option: action
  }}, true)
}

export function getReminder(reminderID) {
  return apiFetch('Reminder/GetReminder', {searchParams: {
    ReminderID: reminderID
  }} )
}

export function getAllReminders() {
  return apiFetch('Reminder/GetReminders')
}

export function getFavorites({page, pageSize}) {
  return apiFetch('Favorites/GetFavorites', {
    searchParams: {
      page,
      pageSize
    }
  }).then(res => {
    return {
      total: res.info.count,
      page: res.info.page,
      data: res.data
    }
  })
}

export function setFeedback(tenderID, feedback) {
  return apiFetch('Tender/SetFeedback', {searchParams: {
    InfoID: tenderID,
    feedback
  }})
}

export function getExtraCount(tags, filters) {
  return apiFetch('Search/RecCount', {searchParams: {
    tags,
    filters
  }})
}

export function publishTender(firstName, lastName, companyName, companyPhone,
  toDate, email, phone, fax, address, title, description) {
  return apiFetch('CustomerTender/InsertTender', {searchParams: {
    FirstName: firstName,
    LastName: lastName,
    CompanyName: companyName,
    CompanyPhone: companyPhone,
    CompanyType: '',
    ToDate: toDate,
    Email: email,
    Phone: phone,
    Fax: fax,
    Adress: address,
    Title: title,
    Details: description
  }})
}

export function contactUs(name, email, phone, text = '', subject = '', msgType = '', tenderID = '') {
  return apiFetch('Email/Register', {searchParams: {
    Name: name,
    Email: email,
    Phone: phone,
    Text: text,
    Campaign: subject,
    MsgType: msgType,
    InfoID: tenderID
  }})
  //return Promise.resolve('test')
}

export function getMainSubjects() {
  return apiFetch('FrontPage/getMainSubjects')
}

export function getAllSubjects() {
  return apiFetch('FrontPage/getAllSubjects')
}

export function getSampleTenders() {
  return apiFetch('FrontPage/GetSampleTenders')
}

export function getSampleTendersBySub(subSubjectID) {
  return apiFetch('FrontPage/GetSampleTendersBySub', {searchParams: {
    SubsubjectID: subSubjectID
  }})
}

export function getAgentSettings() {
  return apiFetch('Agent/GetAgentSettings')
}

export function getSubSubjects() {
  return apiFetch('Lookup/GetSubSubjects2Customer')
}

export function updateAgentSettings(settings) {
  return apiFetch('Agent/UpdateSmartAgentParams', {body: settings, method: 'POST' }, true)
}

export function agentEstimate(settings) {
  return apiFetch('Agent/AgentEstimate', {body: settings, method: 'POST' }, true)
}

export function testLucene(query, text) {
  return apiFetch('Agent/TestLucene', {searchParams: {
    text,
    query
  }})
}

export function logImageView(tenderID) {
  return apiFetch('Tender/SetImgView', {searchParams: {
    TenderID: tenderID
  }})
}

export function getRemindersCount() {
  return apiFetch('Reminder/CountUserReminders', {}, true)
}

export function resetReminders() {
  return apiFetch('Reminder/ResetUserReminders', {}, true)
}

export function mySearches() {
  return apiFetch('Search/MySearches', {}, true)
}

export function saveSearch(searchID) {
  return apiFetch('Search/SaveSearch', {searchParams: {
    SearchID: searchID
  }}, true)
}

export function unSaveSearch(searchID) {
  return apiFetch('Search/UnPinSearch', {searchParams: {
    SearchID: searchID
  }}, true)
}

export function delSearch(searchID) {
  return apiFetch('Search/DelSearch', {searchParams: {
    SearchID: searchID
  }}, true)
}

export function agentMail(mid) {
  return apiFetch('DistributedAgent/AgentMail', {searchParams: {
    mid
  }}, true).then(res => {
    return {
      total: res.info.count,
      page: res.info.page,
      data: res.data
    }
  })
}

export function agentMark(uid) {
  return apiFetch('DistributedAgent/AgentMailSent', {searchParams: {
    uid
  }}, true).then(res => {
    return {
      total: res.info.count,
      page: res.info.page,
      data: res.data
    }
  })
}

function fetchData(url) {
  /* fetch a url that is not in api controllers, such as a json file */

  const headers = new Headers()
  headers.append('Accept', 'application/json')
  headers.append('Content-Type', 'application/json')

  //use credentials: 'include' to allow cookies to pass over cross-origin. needed for login data
  const options = {
    method: 'GET',
    headers,
    credentials: 'include'
  }

  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(response => {
        if (response.ok) {
          const json = response.json()
          cache.add(url, json.response || json)
          return resolve(json.response || json)
        }
        response.json()
          .then((message) => {
            //if (message.Message != 'Authorization has been denied for this request.')
            //notifyMessage(message.Message, 'error')

            return reject({ message: message.Message || message.error, error: response })
          })
          .catch(error => {
            console.error('[fetchData] Error:', error)
            //notifyMessage(error)
          })
      })
  })
}

export function getHomeJSON(folderName, fileName, cache = 0) {
  const query = cache != 0 ? `?cache=${cache}` : ''
  const url = createUrl(`HomeData/${folderName}/${fileName}.json${query}`, {}, false)
  return fetchData(url)
}

export function getFooterPublishers() {
  return apiFetch('FrontPage/GetMainPublishers')
}

export function getSampleTenders2(id) {
  return apiFetch('FrontPage/GetSampleTendersByMainPub', {searchParams: {
    LinkID: id
  }})
}
