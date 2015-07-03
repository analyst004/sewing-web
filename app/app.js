angular.module('sewing-web',
    ['ngRoute', 'about', 'contract', 'privacy', 'point'])

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/', {
                controller:'EntryController',
                templateUrl:'point/entry.html'
            })
            .when('/about', {
                controller:'AboutController',
                templateUrl:'about/about.html'
            })
            .when('/contract', {
                controller:'ContractController',
                templateUrl:'contract/contract.html'
            })
            .when('/privacy', {
                controller:'PrivacyController',
                templateUrl:'privacy/privacy.html'
            })
            .when("/point", {
                controller: 'PointController',
                templateUrl:'point/point.html'
            })
            .otherwise({
                redirectTo:'/'
            });
    }])
