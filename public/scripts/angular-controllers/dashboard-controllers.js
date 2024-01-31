app.controller('dashboardCtrl', ["$rootScope", "$filter",
function($rootScope, $filter) {

    $rootScope.description = "Welcome " + ($rootScope.user.type == 'Agent'? 'Agent ' : '') +
                $filter('sanitizePathString')($rootScope.user.name)

}])
.controller('listAPropertyCtrl', ["$scope", "$rootScope", "$http", "$state", 
function($scope, $rootScope, $http, $state) {

    var fotorama, level = []
    $scope.files = []

    function objIter(fd, obj) {
        Object.entries(obj).forEach(([key, value]) => {
            if (typeof value == 'object'){
                level.push(key)
                objIter(fd, value)
                level.pop()
            } else{
                if (level.length > 0) {
                    for (var i = 1, fdKey = level[0]; i < level.length; i++){
                        fdKey += '[' + level[i] + ']'
                    }
                    fd.append(fdKey + '[' + key + ']', value)
                }else 
                    fd.append(key, value)
            }                   
        })
    }

    $scope.property = {
        contact: { email: $rootScope.user.email }
    }
    $scope.tabs = { maxIndex: 3 }
    $scope.tab = 0

    /*$scope.$watch('tab', (newValue, oldValue) => {
        if (oldValue > newValue)
            $('.circle').eq(oldValue).removeClass('point')
        else 
            $('.circle').eq(newValue).addClass('point')
    })*/

    $rootScope.description = "Enlist a property"

    $scope.list_property = () => {
        if ($scope.repl_list_property.$invalid) return alert('Fill in all required field')
        if ($scope.files.length == 0) return alert('Please select pictures to upload')
        if ($scope.files.length > 15) return alert('Maximum of 15 files allowed')

        var fd = new FormData()
        angular.forEach($scope.files, (file) => { fd.append('photos', file) })

        //iterate over the property object and populate the formData object
        objIter(fd, $scope.property)

        $http.post('../api/dashboard/lp', fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(response => {
            if(response.data == 'repl-success'){
                alert('Property listed successfully')
                $state.reload()
            }
        })
    }

    $('form').on('click', '.remove', () => {
        if(fotorama){
            activeIndex = fotorama.activeIndex
            fotorama.splice(activeIndex, 1)
            $scope.files.splice(activeIndex, 1) 
        }

        if (fotorama.data == null) $('.remove').hide()
    })
    
    $scope.preview = (event) => {
        fotorama = $('.fotorama').fotorama().data('fotorama')
        
        Object.values(event.target.files).forEach(item => {
            url = URL.createObjectURL(item)
            fotorama.push({img: url, thumb: url})
            $scope.files.push(item)
        })

        $('.remove').show();
    }

}])
.controller('propertiesCtrl', ["$rootScope", function($rootScope) {
    $rootScope.description = "All your listed properties"
}])
.controller('propertyCtrl', ["$rootScope", "$scope", "$stateParams", "$http", 
function($rootScope, $scope, $stateParams, $http) {

    $http.get(`../api/dashboard/property/${ $stateParams.propertyId }`).then(
        response => {
            data = []
            
            $scope.property = response.data
            $rootScope.description = $scope.property.name

            $scope.property.photos.forEach(photo => {
                data.push({
                    img: `http://localhost:3000/${ photo }`, 
                    thumb: `http://localhost:3000/${ photo }`
                })
            })

            $('.fotorama').fotorama({ data })
        }
    )

}])