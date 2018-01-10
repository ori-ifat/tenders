export function checkEmail(email, allowEmpty) {
  /* check if a single email given is on email format */
  if (allowEmpty && email == '') {
    return true
  }

  const filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
  if (!(filter.test(email))) {
    return false
  }
  else {
    return true
  }
}

export function checkPhone(phone, allowEmpty) {
  /* test the phone field for valid cell phone number */
  if (allowEmpty && phone == '') {
    return true
  }
  
  phone = phone.replace(/ /g, '')
  //const filter = /^0(5[012345678]|6[47]){1}(\-)?[^0\D]{1}\d{6}$/
  const filter = /^0(5[012345678]){1}(\-)?[^0\D]{1}\d{6}$/

  if (!filter.test(phone)) {
    //console.log('bad phone')
    return false
  }

  return true
}
