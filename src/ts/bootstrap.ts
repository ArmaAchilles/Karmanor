// Font Awesome 5
require('@fortawesome/fontawesome-free');

// Bootstrap 4 requirements
window.Popper = require('popper.js').default;

window.$ = window.jQuery = require('jquery');

// Import Material Design JS
require('bootstrap-material-design');

jQuery(() => $('body').bootstrapMaterialDesign());

// Import flash messaging
import './flash';

// Import Axios
window.axios = require('axios');

// Add lodash
window._ = require('lodash');

window.NODE_ENV = process.env.NODE_ENV || 'development';
