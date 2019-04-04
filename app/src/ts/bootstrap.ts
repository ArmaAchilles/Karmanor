// Font Awesome 5
require('@fortawesome/fontawesome-free');

// Bootstrap 4 requirements
try {
    (<any>window).Popper = require('popper.js').default;
    (<any>window).$ = (<any>window).jQuery = require('jquery');

    require('bootstrap');
} catch (e) { };

// Import Axios
(<any>window).axios = require('axios');
