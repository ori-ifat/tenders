export function getCookie(cookName) {
  //get a cookie by name
  const search = `${cookName}=`
  let returnvalue = ''
  let end

  if (document.cookie.length > 0) {
    let offset = document.cookie.indexOf(search)
	  // if cookie exists
    if (offset != -1) {
      offset += search.length
      // set index of beginning of value
      end = document.cookie.indexOf(';', offset)
      // set index of end of cookie value
      if (end == -1) end = document.cookie.length
      returnvalue = unescape(document.cookie.substring(offset, end))
    }
  }
  if (returnvalue == '-1') returnvalue = ''
  return returnvalue
}

export function setCookie(cookName, val) {
  //set a cookie value by name
  const _date = new Date
  _date.setFullYear(_date.getFullYear( ) + 1)
  document.cookie = `${cookName}=${val}; expires=${_date.toGMTString()};`
}
