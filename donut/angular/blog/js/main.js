'use strict';

/* App Module */
require.config({
    baseUrl: "js",
    waitSeconds: 10,
    paths:{
        text:'./lib/require/text',
        jquery:'./lib/jquery/jquery',
        angular:'./lib/angular/angular'
    },
    shim: {
        angular: {
            deps: ["./lib/angular/angular-loader"],
            callback: function(loader){
                console.log('angular-loader!');
            },
            exports: "angular"
        }
    },
    priority:[
        'angular'
    ],
    urlArgs:'v=1.3'
});

require([
    "angular",
    "jquery",
    "resources/js/rout.js",
    "text", 
    'app'
], function(angular){
    $(document).ready(function () {
        angular.bootstrap(document, ['blog']);
    });
});