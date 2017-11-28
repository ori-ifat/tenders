import 'whatwg-fetch'
import cache from 'common/utils/cache'
//import {notifyMessage} from 'common/utils/notifications'

let apiBaseUrl
let baseUrl
if (process.env.NODE_ENV === 'development') { // || location.href.indexOf('iis-test/') > -1) {
  apiBaseUrl = 'http://192.118.60.25/TendersSiteApi/api'
  baseUrl = 'http://192.118.60.25/TendersSiteApi'
}
else {
  apiBaseUrl = 'http://iis-test/TendersSiteApi/api'
  baseUrl = 'http://iis-test/TendersSiteApi'
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
  return apiFetch('Search/GetFilters', {
    searchParams: {
      tags, filters, sort
    }
  })
}

export async function fetchResultsPage({tags, filters, page, pageSize, sort}) {
  return apiFetch('Search/ResultPage', {
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

export async function getLastTenders(lastSeenTenderID) {
  return apiFetch('Tender/GetLastTenders', {searchParams: {
    LastSeenTenderID: lastSeenTenderID
  }}, true)
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

export function setReminder(action, reminderID, tenderID, remark, title, reminderDate) {
  //add more fields if needed, Ex. email, sms ...
  return apiFetch('Reminder/ReminderOptions', {searchParams: {
    ReminderID: reminderID,
    InfoID: tenderID,
    Remark: remark,
    Title: title,
    Sms: '',
    Email: '',
    ReminderDate: reminderDate,
    Option: action
  }}, true)
}

export function getReminder(reminderID) {
  return apiFetch('Reminder/GetReminder', {searchParams: {
    ReminderID: reminderID
  }} )
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
