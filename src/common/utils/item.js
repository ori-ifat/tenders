import moment from 'moment'

export function setDateLabel(date, format, noDateLabel) {
  return date != null ? moment(date).format(format) : noDateLabel
}

export function isDateInRange(date, numOfDays) {
  //return  moment(date) > moment() && moment(date) < moment().add(numOfDays, 'days')  
  return  moment(date).startOf('day') > moment().startOf('day') && moment(date).startOf('day') < moment().add(numOfDays, 'days').startOf('day')
}
