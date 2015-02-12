/*global sbc2, $*/


window.sbc2 = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        'use strict';
        new sbc2.Views.AppView({
            el : $('.container'),
            model : new sbc2.Models.AppModel()
        })
    },
    convert_server : "http://178.62.17.240/"
};

$(document).ready(function () {
    'use strict';
    sbc2.init();
});
