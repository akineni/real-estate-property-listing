app.config(["$stateProvider", "$urlRouterProvider", ($stateProvider, $urlRouterProvider) => {

	$stateProvider.state("dashboard", {
		url: "/",
		templateUrl: "../partials/dashboard.html",
		controller: "dashboardCtrl"
	}).state("list-a-property", {
		url: "/list-a-property",
		templateUrl: "../partials/list-a-property.html",
		controller: "listAPropertyCtrl"
	}).state("properties", {
		url: "/properties",
		templateUrl: "../partials/properties.html",
		controller: "propertiesCtrl"
	}).state("properties.property", {
		url: "/:propertyId",
		views: {
			"@": {
				templateUrl: "../partials/properties.property.html",
				controller: "propertyCtrl"
			}
		}
	})/*.state("information", {
		url: "/information",
		views: {
			"@": {
				templateUrl: "../views/information_template.html?v=0",
				controller: "informationCtrl"
			},
			"mode@information": {
				templateUrl: "../views/information.html"
			}
		}
	}).state("notifications", {
		url: "/notifications",
		templateUrl: "../views/notifications.html",
		controller: "notificationsCtrl",
		resolve: {
			notifications: ["$http", function($http){
				return $http.get("../dashboard/fetch_notifications.php");
			}]
		}
	});*/

	$urlRouterProvider.otherwise("/");
}]);