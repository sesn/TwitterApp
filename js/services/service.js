app.factory('AuthenticationService', [ '$http','$cookieStore', '$rootScope', 'Base64',
	function($http, $cookieStore, $rootScope, Base64){
		var service = {};
        var $jsonLoginData;
		/*Service Login */
		service.Login = function( username, password, callback) {
			
			$http({
				method: 'POST',
				url: 'ajax/login-check.php',
				data: {
					userName: username,
					userPass: password
				}
			}).success(function(data, status, headers, config){
                $jsonLoginData = data;
				callback(data);
			}).error(function(){
				console.log('error');
			});

		}

        /*Set the Credentials*/
        service.SetCredential = function($username, $password) {
            var $authData = Base64.encode($username + ':' + $password);

            $rootScope.globals = {
                currentUserInfo: {
                    userName: $userName,
                    adminType: $jsonLoginData.adminType,
                    adminMail: $jsonLoginData.adminMail,
                    adminContactMail: $jsonLoginData.adminContactMail,
                    message: $jsonLoginData.message,
                    authData: $authData 
                }
            }

            $http.defaults.headers.common['Authorization'] = 'Basic' + $authData;
            $cookieStore.put('globals', $rootScope.globals);
           //$cookieStore.put('fav',$rootScope.globals);
        }

        /*Clear credentails*/
        service.ClearCredential = function() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
           // console.log($cookieStore.get('globals'));

            $http.defaults.headers.common.Authorization = 'Basic';
        }

		return service;

	}]);


app.factory('Base64', function(){
	var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	var service ={};

	service.encode = function(input) {
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i=0;

		do {
			chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
  
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
  
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
  
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
  
            return output;
	}

	service.decode = function(input) {
		var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            window.alert("There were invalid base64 characters in the input text.\n" +
                "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return output;
	}

	return service;
});

/*Export to excel*/
app.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    return {
        tableToExcel: function (tableId, worksheetName) {
            var table = $(tableId),
                ctx = { worksheet: worksheetName, table: table.html() },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
})