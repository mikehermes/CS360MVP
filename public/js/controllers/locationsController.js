airQualityApp.controller("LocationsController", ['$scope', '$http',
    function ($scope, $http) {

        $scope.locations = [];

        $http.get('/api/user/locations').success(function (locations) {
            console.log(locations)
            for (var i = 0; i < locations.length; i++) {
                var location = locations[i]
                var long = location.longitude
                var lat = location.latitude
                var url = "/api/airdata/coordinates?long=" + long + "&lat=" + lat;
                $http.get(url)
                    .success(function (data) {
                        var tmp = {}
                        tmp.name = data[0].ReportingArea + ", " + data[0].StateCode
                        tmp.quality = data[0].Category.Name
                        tmp.longitude = data[0].Longitude
                        tmp.latitude = data[0].Latitude
                        $scope.locations.push(tmp)
                    })
            }
        })


        $scope.add = function () {
            if ($scope.newLocation) {
                var url = "/api/user/add/zipcode/" + $scope.newLocation
                $http.get(url)
                    .success(function (data) {
                        if (!data[0]) {
                            alert('no data for that url')
                            return;
                        }

                        var name = data[0].ReportingArea + ", " + data[0].StateCode
                        var quality = data[0].Category.Name
                        var long = data[0].Longitude
                        var lat = data[0].Latitude

                        var tmp = {
                            name: name,
                            quality: quality,
                            longitude: long,
                            latitude: lat
                        }
                        $scope.locations.push(tmp)
                    })
            }
            $scope.newLocation = "";

        }

        $scope.remove = function (i) {
            var location = $scope.locations[i]
            var url = "/api/user/locations?long=" + location.longitude + "&lat=" + location.latitude;
            
            $http.delete(url).success(function(data){
                console.log(data)
                $scope.locations.splice(i, 1)
            })
        }


}])