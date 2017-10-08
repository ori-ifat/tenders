import $ from 'jquery'

const FoundationHelper = {
  initElement(elem) {
    //console.log(`FoundationHelper initElement ${elem}`)
    $(`#${elem}`).foundation()
  }
}

export default FoundationHelper
