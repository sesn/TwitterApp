/*Custom Sorting*/
app.directive('customSort', function(){
	return {
		restrict : "A",
		transclude: true,
		scope: {
			order: '=',
			sort: '=' 
		},
		template: 
			'<a ng-click="sort_by(order)" style="color: #555">' +
			'<span ng-transclude></span>' +
			'<i ng-class="selectedCls(order)"></i>' +
			'<a>',

		link: function(scope) {
			scope.sort_by = function(newSortngOrder) {
				var sort = scope.sort;
				if(sort.sortingOrder == newSortingOrder) {
					sort.reverse = !sort.reverse;
				}

				sort.sortingOrder = newSortingOrder;
			};

			scope.selectedCls = function(column) {
				if(column == scope.sort.sortingOrder) {
					 return ('icon-chevron-' + ((scope.sort.reverse) ? 'down' : 'up'));
				}
				else {
					return 'icon-sort';
				}
			};
		}
	};
});

/*Custom DatePicker*/
app.directive("datePicker", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var options = {
        dateFormat: "dd/mm/yy",
         timeFormat: 'hh:mm',
        onSelect: function (dateText) {
        	 scope.$apply(function () {
	          ngModelCtrl.$setViewValue(dateText);
	        });
          
        }
      };
      elem.datepicker(options);
    }
  };
});


/*Custom DateTimePicker*/
app.directive("datetimePicker", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
    	var options = {
    		//format:'d.m.Y H.i',
    		onChangeDateTime: function(dateTime) {
    			scope.$apply(function() {
    				ngModelCtrl.$setViewValue(dateTime);
    			});
    		}
    	};
      	elem.datetimepicker(options);
    }
  };
});

/*Custom Time */
app.directive('timePicker', function(){
	return {
		restrict: "A",
		require: "ngModel",
		link: function(scope, elem, attrs, ngModelCtrl) {
			function calcTime(city, offset) {

			    // create Date object for current location
			    d = new Date();
			    
			    // convert to msec
			    // add local time zone offset 
			    // get UTC time in msec
			    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
			    
			    // create new Date object for different city
			    // using supplied offset
			    nd = new Date(utc + (3600000*offset));
			    
			    // return time as a string
			    return nd.toLocaleString();

			}

			ngModelCtrl.$setViewValue(calcTime('Bombay','+5.5'));

		}
	};
});

/*Table Sort*/
app.directive('customTable', function(){
	return {
		restrict: "A",
		transclude: true,
		template: 
			'<a ng-click="onClick()">' +
				'<span ng-transclude></span>' + 
				 '<i class="glyphicon" ng-class="{\'glyphicon-sort-by-alphabet\' : order === by && !reverse,  \'glyphicon-sort-by-alphabet-alt\' : order===by && reverse}"></i>'+
			'</a>',
		scope: {
			order: '=',
			by: '=',
			reverse: '='
		},
		link: function(scope, elem, attrs) {
			scope.onClick = function() {
				if(scope.order === scope.by) {
					scope.reverse = !scope.reverse;
				} else {
					scope.by = scope.order;
					scope.reverse = false;
				}
			};
		}
	};
});


/*Modal*/
app.directive('customModal', function(){
	return {
		replace: true,
		transclude: true,
		scope: {
			show: '='	
		},
		link: function(scope, elem, attrs) {
			scope.dialogStyle = {};
			if(attrs.width) {
				scope.dialogStyle.width = attrs.width;
			}
			if(attrs.height) {
				scope.dialogStyle.height = attrs.height;
			}
			scope.hideModal = function() {
				scope.show = false;
			};
		},
		template: 
			'<div class="ng-customModal" ng-show="show">' +
				'<div class="ng-customModal-overlay"></div>' +
				'<div class="ng-customModal-dialog" ng-style="dialogStyle">'+
					'<div class="ng-customModal-close">X</div>' +
					'<div class="ng-customModal-content" ng-transclude></div>' +
				'</div>' +
			'</div>'
		
	};
});