import remove from 'lodash/remove'
import find from 'lodash/find'

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
