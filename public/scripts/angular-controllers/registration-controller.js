app.controller('registrationCtrl', ["$scope", "$rootScope", "$http", "$window", 
    ($scope, $rootScope, $http, $window) => {
        $scope.register = () => {
            if ($scope.repl_registration.$invalid) return

            $rootScope.preLoader.loading = true

            $http.post(
				"api/register",
				$scope.user, //undefined value/field in data object isn't sent
			).then(
				(response) => {
					if(response.data == "repl-success") $window.location.href = "/dashboard"
				},
				(error) => {
                    if (error.data.validationErrors) $scope.validationErrors = error.data.validationErrors
                    $rootScope.preLoader.loading = false
				}
			)
        }
    }
])