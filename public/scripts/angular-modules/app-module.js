var deps = []
try{
	angular.module("ui.router");
	deps.push("ui.router");
}catch(e){}

var app = angular.module('app', deps)

app.run(["$rootScope", ($rootScope) => {

    $rootScope.preLoader = { loading: false }
    $rootScope.minLength = { password: 8 }

}])
.directive('appPreLoader', () => {
    return {
        restrict: 'E',
        templateUrl: 'partials/pre-loader.component.html'
    }
})