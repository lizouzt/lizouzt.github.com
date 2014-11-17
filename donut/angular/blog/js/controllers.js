'use strict';

/* Controllers */
define(["angular"], function (angular){
    var controllerModule = angular.module('blogControllers', []);
    controllerModule.controller('ListController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
        $http.get("data/list.json").success(function(result){
            $scope.blogs = result;
        });
        $scope.orderProp = "date";
        $scope.message = "I'm the list controller!";
        $scope.query = $routeParams.query;
    }]);

    controllerModule.controller('SearchController', ['$scope', function ($scope){
        
    }]);

    controllerModule.controller('BlogController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
        $scope.message = $routeParams.id;
    }]);
});