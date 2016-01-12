var app = angular.module("twitterApp", ['ui.router','ngCookies','highcharts-ng']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	//$locationProvider.html5Mode(true);

	$urlRouterProvider.otherwise('/login');
	var $sitePrefix = '/Project/TwitterApp/';

	$stateProvider
		.state('/', {
			url: '/login',
			templateUrl: 'view/login.html',
			controller: 'loginCtrl'
		})
		.state('dashboard',{
			url: '/dashboard',
			templateUrl: 'view/dashboard.html',
			controller: 'dashboardCtrl',
			abstract: true
			
		})
		.state('dashboard.overviewHashTag',{
			url: '',
			templateUrl: 'view/dashboard/overview.html',
			controller: 'overviewHashTagCtrl'
		})
		.state('dashboard.addHashTag', {
			url: '',
			templateUrl: 'view/dashboard/addHashTag.html',
			controller: 'addHashTagCtrl'
		}) 
		.state('hashtag',{
			url: '/:hashtagName',
			templateUrl: 'view/hashtagProfile.html',
			controller: 'hashtagProfileCtrl'
			
			
		})
		.state('/logout', {
			url: '/login',
			controller: 'logOutCtrl'
		});

});

app.run(function($rootScope, $location, $cookieStore, $http){


	$rootScope.globals = $cookieStore.get('globals') || {};
	console.log($cookieStore.get('globals'));
	if($rootScope.globals.currentUserInfo) {
		$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUserInfo.authdata; 
		
	}
	 $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            //$location.path('/dashboard');
            if ($location.path() !== '/login' && !$rootScope.globals.currentUserInfo) {
            	$cookieStore.remove('globals')
                $location.path('/login');
            }

            if($cookieStore.get('globals')) {
            	if($location.path() == '/login') {
            		$location.path('dashboard');
            }
            	
            }
            
        });
});