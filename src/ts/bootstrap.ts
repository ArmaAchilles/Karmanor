// Font Awesome 5
require('@fortawesome/fontawesome-free');

// Bootstrap 4 requirements
try {
    (<any>window).Popper = require('popper.js').default;

    const $ = require('jquery');
    (<any>window).$ = (<any>window).jQuery = $;

    // Import Material Design JS
    require('bootstrap-material-design');

    $(document).ready(function () { $('body').bootstrapMaterialDesign(); });
} catch (e) { };

// Import flash messaging
import './flash';

// Import Axios
(<any>window).axios = require('axios');

// Add lodash
(<any>window)._ = require('lodash');
