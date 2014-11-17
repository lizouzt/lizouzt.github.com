'use strict';

/* Filters */
define(["angular"], function (angular) {
	angular.module('blogFilters', []).filter('checkmark', function(){
		return function(input, query){
			input = query + input;
            return input;
	    };
	});
});