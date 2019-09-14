angular.module("ManagerApp").
controller("FreedomListCtrl", ["$scope", "$http", "$rootScope", "$timeout", function ($scope, $http, $rootScope, $timeout) {
    $scope.freedomData = [];
    $scope.alertCheck = true;
    $scope.loadData = loadData;

    $scope.allDeleteCheck = true;
    $scope.delete = deleteF;

    $scope.currentPage = 0;

    loadData(0);

    function deleteF(data) {
        var url = "../api/v1/freedoms";
        url = url + "/" + data.country + "/" + data.year;
        $http
            .delete(url)
            .then(function (response) {
                filterStatus(response.status);
                $scope.currentPage = 0;
                loadData(0);
            }, function (err) {
                filterStatus(err.status);
            });
    }

    function loadData(num) {
        var url = "../api/v1/freedoms";
        var params = {
            limit: 10,
            offset: 10 * ($scope.currentPage + num)
        };
        if ($scope.contryFilter && $scope.contryFilter != "") {
            url = url + "/" + $scope.contryFilter;
        }
        if (!isNaN(parseInt($scope.fromFilter)) && !isNaN(parseInt($scope.toFilter))) {
            params.from = $scope.fromFilter;
            params.to = $scope.toFilter;
        };
        $http.get(url, {
                params: params
            })
            .then(function (response) {
                filterStatus(response.status);
                $scope.currentPage = $scope.currentPage + num;
                $scope.freedomData = response.data;
            }, function (err) {
                filterStatus(err.status, num);
            });
    }

    function filterStatus(status, num) {
        switch (status) {
            case 200:
                $scope.alertMsg = "Operacion realizada con exito";
                $scope.alertClass = "alert-success"
                break;

            case 400:
                $scope.alertMsg = "Campos invalidos";
                $scope.alertClass = "alert-warning"
                break;

            case 404:
                $scope.alertMsg = "No hay datos para la siguiente pagina";
                $scope.alertClass = "alert-warning"
                if (num == 0) {
                    $scope.freedomData = [];
                    $scope.alertMsg = "No hay datos para los datos introducidos";
                }
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

}]);