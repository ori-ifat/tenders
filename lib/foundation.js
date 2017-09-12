// jQuery
const $ = require('jquery')
global.jQuery = $

// if you want all features of foundation
require('../node_modules/foundation-sites/dist/js/foundation.min.js')

// if you want only some features
// require('./node_modules/what-input/what-input');
// require('./node_modules/foundation-sites/js/foundation.core');
// require('./node_modules/foundation-sites/js/....');

$(document).foundation()
$( document ).ready(function() {
  $('input.checkbox_tender').change(function() {

    if ($('input.checkbox_tender').is(':checked')) {
    	$(this).parent().parent().parent().parent().parent().addClass('checked')
    	$('#action_bar').addClass ('active')

    } else {
    	$(this).parent().parent().parent().parent().parent().removeClass('checked')
    	$('#action_bar').removeClass ('active')
    }
  })

  $('input[type=checkbox]').click(function (e) {
    e.stopPropagation()
  })
})

export default Foundation
