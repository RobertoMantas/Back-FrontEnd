angular.module("ManagerApp").
controller("FreedomEditCtrl", ["$scope", "$location", "$routeParams", "$http", "$timeout",
    function ($scope, $location, $routeParams, $http, $timeout) {
        $scope.data = {};
        $scope.alertCheck = true;
        $scope.btnMsg = "Añadir";
        var url = "../api/v1/freedoms";
        $scope.submit = postF;

        if ($routeParams.country != undefined) {
            $scope.btnMsg = "Editar";
            getF($routeParams);
            $scope.submit = putF;
        }

        function getF(data) {
            url = url + "/" + data.country + "/" + data.year;
            $http
                .get(url)
                .then(function (response) {
                    filterStatus(response.status);
                    $scope.data = response.data[0];

                }, function (err) {
                    filterStatus(err.status);
                });
        }

        function postF() {
            $http.post(url, $scope.data)
                .then(function (response) {
                    filterStatus(response.status);
                    $timeout(function () {
                        $location.path("/freedoms");
                    }, 1000);
                }, function (err) {
                    filterStatus(err.status);
                });
        }

        function putF() {
            $http.put(url, $scope.data)
                .then(function (response) {
                    filterStatus(response.status);
                }, function (err) {
                    filterStatus(err.status);
                });
        }

        function filterStatus(status) {
            switch (status) {
                case 201:
                case 200:
                    $scope.alertMsg = "Operacion realizada con exito";
                    $scope.alertClass = "alert-success"
                    break;

                case 400:
                    $scope.alertMsg = "Campos invalidos";
                    $scope.alertClass = "alert-warning"
                    break;

                case 404:
                    $scope.alertMsg = "No hay datos para los datos introducidos";
                    $scope.alertClass = "alert-warning"
                    $scope.freedomData = [];
                    break;

                case 405:
                    $scope.alertMsg = "Operacion no permitida";
                    $scope.alertClass = "alert-danger"
                    break;

                default:
                    $scope.alertMsg = "Ha surgido algun problema, pruebe más tarde";
                    $scope.alertClass = "alert-danger"
                    break;
            }
            $scope.alertCheck = false;
            $timeout(function () {
                $scope.alertCheck = true;
            }, 3000);
        }

    }
]);