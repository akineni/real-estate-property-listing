app.controller('loginCtrl', ["$scope", "$rootScope", "$http", "$window", 
    ($scope, $rootScope, $http, $window) => {

        $scope.login = () => {
            if ($scope.repl_login.$invalid) return

            $rootScope.preLoader.loading = true

            $http.post(
				"api/log-in",
				$scope.user, //undefined value/field in data object isn't sent
			).then(
				(response) => {
					if(response.data == "repl-success") $window.location.href = "/dashboard"
                    else $scope.err_msg = "Account not found"
                    
                    $rootScope.preLoader.loading = false
				},
				(error) => {
                    $scope.err_msg = "Account not found";
                    $rootScope.preLoader.loading = false
				}
			)
        }
    }
])