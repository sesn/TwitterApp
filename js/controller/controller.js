/*CONTROLLER FOR LOGIN PROCESS*/
app.controller('loginCtrl', ['$scope','$rootScope','$location', 'AuthenticationService', '$cookieStore',
	function($scope, $rootScope, $location, AuthenticationService, $cookieStore) {
	$scope.user = { userName: "", userPass: "" };

	AuthenticationService.ClearCredential();
	$scope.submit = function() 
	{ 
		
		$userName = $scope.user.userName;
		$userPass = $scope.user.userPass;
		AuthenticationService.Login($userName, $userPass, function($data) {


			if($data.loggedIn) {
				AuthenticationService.SetCredential($userName, $userPass);
				//console.log($rootScope.globals);
				$location.path('dashboard');
			}
			else {
				console.log('a');
				console.log($data.message);
			}
			

		});
		
	};
}]);

/*LOGOUT CONTROLLER*/
app.controller('logOutCtrl', ['$scope','$rootScope','$location', 'AuthenticationService', '$cookieStore',
	function($scope, $rootScope, $location, AuthenticationService, $cookieStore) {
	$scope.user = { userName: "", userPass: "" };

	AuthenticationService.ClearCredential();
	$rootScope.globals ={};
}]);

/*CONTROLLER FOR DASHBOARD PAGE*/
app.controller('dashboardCtrl', ['$scope', '$state', '$rootScope', '$http', '$location' ,
	function($scope, $state, $rootScope, $http, $location){
		var $innerPage;
		$http({
			method: 'POST',
			url: 'ajax/dashboard.php',
			data: { 
				page: "dashboard",
				innerPage: "overview"
			}

		}).success(function(data, config, status, headers) {
			//console.log(data);
			$destinationPage = data.destinationPage;
			if($destinationPage == "add") {
				$state.go('dashboard.addHashTag');
			}
			else {
				$state.go('dashboard.overviewHashTag');
			}
		}).error(function(){
			console.log('error');
		});


		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			console.log($state.href($state.current.name, $state.params, {absolute: true}));
			//console.log(window.location.href);
		   
		});

}]);

/*CONTROLLER FOR ADDING HASHTAG*/
app.controller('addHashTagCtrl', ['$scope', '$http', '$rootScope', 
	function($scope, $http, $rootScope){
		$scope.hashTag = { name: "", activation: "", createdBy: "" };
		var $date = new Date();

		$scope.hashTag.createdBy = $rootScope.globals.currentUserInfo.userName;
		$hashTagName = $scope.hashTag.name;
		
		$activationDateTime = $scope.hashTag.activation;

		$scope.submit = function(){
			$http({
				method: 'POST',
				url: 'ajax/dashboard.php',
				data: {
					
					page: "dashboard",
					innerPage: "add",
					hashTagName: $scope.hashTag.name,
					activationDateTime : $scope.hashTag.activation,
					createdBy : $rootScope.globals.currentUserInfo.userName,
					createdTime: $date.toLocaleString(),

				}
			}).success(function(data, status, headers, config){
				
			});

		};
		
}]);

/*OVERVIEW HASHTAG TABLE CONTROLLER*/
app.controller('overviewHashTagCtrl', ['$scope', '$http', '$rootScope', '$timeout','Excel',
	function($scope, $http, $rootScope, $timeout, Excel){
		//$scope.overviewInfo = { hashtagArray1: "", message: "" };
		$http({
			method: 'POST',
			url: 'ajax/dashboard.php',
			data: {
				page: "dashboard",
				innerPage: "overview",
			},
		}).success(function(data, status, headers, config){
			console.log(data);
			$scope.hashtagArray = data.hashtagArray;
			
			$scope.order = "'hashtagName'";
			$scope.reverse= false;

		});
		
		$scope.delete = function(x){
			
			$http({
				method: 'POST',
				url: 'ajax/dashboard.php',
				data: {
					page: "dashboard",
					innerPage: "delete",
					hashtagName: x.hashtagName
				},
			}).success(function(data, status, headers, config){
				var spliceStart;
				for(var i=0; i< $scope.hashtagArray.length; i++) {
					var index = $scope.hashtagArray[i].hashtagName.indexOf(x.hashtagName);	
					if(index >=0) {
						spliceStart = i;
					}
				}
				$scope.hashtagArray.splice(spliceStart,1);
			});
		};
		
		
		$scope.exportToExcel = function (tableId) { 
            debugger;
            var exportHref = Excel.tableToExcel(tableId, 'Overview');
            $timeout(function () { location.href = exportHref; }, 100); // trigger download
        };
}]);

/*OVERVIEW CHART CONTROLLER*/
app.controller('overviewChartCtrl',['$scope', function($scope) { 
	$scope.chartConfig = {
        options: {
            chart: {
                type: 'line'
            },
			rangeSelector: {
				enabled: true
			}
        },
        series: [{
			
            data: [10, 200, 12, 8, 7]
        }],
        title: {
            text: 'Overview'
        },
        loading: false,
		useHighStocks: true,
		size: {
		   width: 700,
		   height: 300
		  },
    };

}]);
app.controller('myctrl', function ($scope) {

    $scope.addPoints = function () {
        var seriesArray = $scope.chartConfig.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
    };

    $scope.addSeries = function () {
        var rnd = []
        for (var i = 0; i < 10; i++) {
            rnd.push(Math.floor(Math.random() * 20) + 1)
        }
        $scope.chartConfig.series.push({
            data: rnd
        })
    }

    $scope.removeRandomSeries = function () {
        var seriesArray = $scope.chartConfig.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray.splice(rndIdx, 1)
    }

    $scope.swapChartType = function () {
        if (this.chartConfig.options.chart.type === 'line') {
            this.chartConfig.options.chart.type = 'bar'
        } else {
            this.chartConfig.options.chart.type = 'line'
            this.chartConfig.options.chart.zoomType = 'x'
        }
    }

    $scope.toggleLoading = function () {
        this.chartConfig.loading = !this.chartConfig.loading
    }

    $scope.chartConfig = {
        options: {
            chart: {
                type: 'bar'
            }
        },
        series: [{
            data: [10, 15, 12, 8, 7]
        }],
        title: {
            text: 'Hello'
        },

        loading: false
    }

});

/*HASHTAG PROFILE CONTROLLER*/
app.controller('hashtagProfileCtrl', ['$scope', '$http','$state','Excel','$timeout',function($scope, $http, $state, Excel, $timeout) {
	
	var $hashtagName = $state.params.hashtagName;
	
	$http({
		method: 'POST',
		url: 'ajax/hashtagProfile.php',
		data: {
			hashtagName: $hashtagName
		},	
	}).success(function(data, status, headers, config){
		console.log('asd');
	});

}]);
