app.directive('breadCrumb', () => {
    return {
        restrict: 'E',
        template: `<ol class="breadcrumb">
        <li ng-repeat="p in path()" ng-switch="$last">
            <span ng-switch-when="true">{{ p | sanitizePathString }}</span>
            <a ui-sref="{{p}}" ng-switch-when="false">{{ p | sanitizePathString }}</a></li>
      </ol>`,
        controller: ["$scope", "$location", function($scope, $location) {
            $scope.path = () => {
                var p = $location.path().split('/').filter((i) => { return i.length != 0 })
                p.unshift('dashboard')
                return p
            }
        }]
    }
})
.directive('properties', () => {
    return {
        restrict: 'E',
        templateUrl: '../partials/properties-directive.html',
        controller: ["$scope", "$http", function($scope, $http) {
            $http.get('../api/dashboard/properties').then(response => {
                $scope.properties = response.data.document
            },
            error => {})
        }]
    }
})
.directive('property', () => {
    return {
        restrict: 'E',
        templateUrl: '../partials/property-directive.html',
        replace: true
    }
})
.filter("sanitizePathString", () => {
    return input => {
        strArr = input.split('-')
        .map(str => str.length > 1 ? str.charAt(0).toUpperCase() + str.substr(1): str)

        return strArr.join(' ')
    }
})
.filter("removeObj", () => {
    return obj => {
        tmp = angular.copy(obj)
        for(property in tmp) {
            if(typeof tmp[property] == 'object') delete tmp[property]
        }
        return tmp
    }
})
.filter("objToString", () => {
    return input => {
        str = ''
        if(typeof input == 'object'){
            for(property in input) {
                str += property + ': ' + input[property] + ', '
            }
            str = str.substr(0, str.lastIndexOf(', '))
            return str
        }
        return input
    }
})
.filter("limitWords", () => {
    return (input, count) => {
        return input.substr(0, count) + "..."
    }
})
.filter("url", () => {
    return input => {
        return input.replace(/\134/g, '/')
    }
})
.run(["$rootScope", "$location", "$http", ($rootScope, $location, $http) => {
    $rootScope.currentRoute = () => {
        var path = $location.path()
        return path == '/' ? 'dashboard' : path.substr(path.lastIndexOf('/') + 1)
    }

    $http.get("../api/dashboard/cu").then( response => {
            if ( response.data.document ) $rootScope.user = response.data.document         
        },
        error => {}
    )
}])
.config(["$locationProvider", $locationProvider => {
    $locationProvider.html5Mode(true)
}])