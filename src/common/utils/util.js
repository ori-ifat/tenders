import remove from 'lodash/remove'
import find from 'lodash/find'
import {addToFavorites, clearCache} from 'common/services/apiService'

export function setCheckedStatus(checkedItems, checked, value, isFavorite) {
  if (checked) {
    const found = find(checkedItems, item => {
      return item.TenderID == value
    })
    if (!found) checkedItems.push({ TenderID: value, IsFavorite: isFavorite })
  }
  else {
    remove(checkedItems, item => {
      return item.TenderID === value
    })
  }
}

export function setFavStatus(checkedItems, tenderID, add) {
  const action = add ? 'Favorite_add' : 'Favorite_del'
  addToFavorites(action, [tenderID])
  clearCache()
  const found = find(checkedItems, item => {
    return item.TenderID == tenderID && item.IsFavorite != add
  })
  if (found) {
    //if item is in checkedItems array, need to update its fav state
    remove(checkedItems, item => {
      return item.TenderID === tenderID
    })
    //add the item again with new fav state
    checkedItems.push({ TenderID: tenderID, IsFavorite: add })
  }
}

export function getImageUrl(fileName) {
  const cleanFileName = fileName.replace(/\\/g, '/').replace(/\/\/int_fs\/Clips/g, '')
  const url = cleanFileName.indexOf('ColorClp') > -1 || cleanFileName.indexOf('ClipsPdf') > -1 ?
    `http://www.ifatmediasite.com/CustomerMedia/ClipsImages${cleanFileName}` :
    ''
  console.log('getImageUrl', url)
  return url
}
