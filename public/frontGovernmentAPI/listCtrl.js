/* global angular */
/* global M */
/* global $ */
var previousPage;
var nextPage;
var setPage;

angular.module("ManagerApp").
    controller("GovernmentListCtrl", ["$scope", "$http", "$rootScope", function ($scope, $http, $rootScope) {
        console.log("Government ListCtrl initialized");

        if (!$rootScope.apikey) $rootScope.apikey = "keyRob";

        $scope.search = {};
        $scope.searchAdd = {};

        $scope.data = {};
        var dataCache = {};
        $scope.currentPage = 1;
        $scope.maxPages = 1;
        $scope.pages = [];
        $scope.pagesLeft = [];
        $scope.pagesMid = [];
        $scope.pagesRight = [];

        var modifier = "";
        var properties = "";

        var elementsPerPage = 2;

        $scope.previousPage = function () {
            var a;
            console.log("offset antes-: " + $scope.currentPage);
            a = (($scope.currentPage - 1) * 2) - 2;
            console.log("offset despues-: " + a);
            $http
                .get("../api/v1/governments" + modifier + "?" + "apikey=" + $rootScope.apikey + "&limit=2&offset=" + a)
                .then(function (response) {
                    properties = "limit=2&offset=" + a;
                    $scope.currentPage--;
                    $scope.refreshPage();
                    refresh();

                });
        };

        $scope.nextPage = function () {
            var a;
            console.log("offset antes+: " + $scope.currentPage);
            a = (($scope.currentPage + 1) * 2) - 2;
            console.log("offset despues +: " + a);
            $http
                .get("../api/v1/governments" + modifier + "?" + "apikey=" + $rootScope.apikey + "&limit=2&offset=" + a)
                .then(function (response) {
                    properties = "limit=2&offset=" + a;
                    $scope.currentPage++;
                    $scope.refreshPage();

                    refresh();
                });
        };

        $scope.refreshPage = function () {

            if ($scope.currentPage <= 0) $scope.currentPage = 1;
            if ($scope.currentPage > $scope.maxPages) $scope.currentPage = $scope.maxPages;


            $scope.data = dataCache;
            console.log("estamos en la pagina: " + $scope.currentPage);
            console.log("maximo de paginas: " + $scope.maxPages);
        };

        $scope.refreshBotton = function () {
            $scope.maxPages = 1;
            $scope.currentPage = 1;
            properties = "";
            refresh();
        };

        var refresh = $scope.refresh = function () {
            $http
                .get("../api/v1/governments" + modifier + "?" + "apikey=" + $rootScope.apikey + "&" + properties)
                .then(function (response) {
                    if ($scope.maxPages < Math.max(response.data.length / elementsPerPage))
                        $scope.maxPages = Math.ceil(response.data.length / elementsPerPage);
                    dataCache = response.data;
                    //console.log(JSON.stringify(dataCache, null, 2));
                    $scope.refreshPage();
                }, function (response) {
                    switch (response.status) {
                        case 401:
                            M.toast('<i class="material-icons">error_outline</i> Error getting data - api key missing!', 4000);
                            break;
                        case 403:
                            M.toast('<i class="material-icons">error_outline</i> Error getting data - api key incorrect!', 4000);
                            break;
                        case 404:
                            $scope.maxPages = 1;
                            dataCache = {};
                            $scope.refreshPage();
                            M.toast('<i class="material-icons">error_outline</i> No data found!', 4000);
                            break;
                        default:
                            M.toast('<i class="material-icons">error_outline</i> Error getting data!', 4000);
                            break;
                    }
                });
        };

        $scope.addData = function () {
            $http
                .post("../api/v1/governments" + "?" + "apikey=" + $rootScope.apikey, $scope.newData)
                .then(function (response) {
                    console.log("Data added!");
                    M.toast('<i class="material-icons">done</i> ' + $scope.newData.country + ' has been added succesfully!', 4000);
                    $scope.refreshBotton();
                    refresh();
                }, function (response) {
                    M.toast('<i class="material-icons">error_outline</i> Error adding data!', 4000);
                }, function (response) {
                    switch (response.status) {
                        case 400:
                            M.toast('<i class="material-icons">error_outline</i> Error adding data - incorrect data was entered!!', 4000);
                            break;
                        case 401:
                            M.toast('<i class="material-icons">error_outline</i> Error getting data - api key missing!', 4000);
                            break;
                        case 403:
                            M.toast('<i class="material-icons">error_outline</i> Error getting data - api key incorrect!', 4000);
                            break;
                        default:
                            M.toast('<i class="material-icons">error_outline</i> Error adding data!', 4000);
                            break;
                    }
                });
        };

        $scope.delData = function (data) {
            $http
                .delete("../api/v1/governments/" + data.country + "/" + data.year + "?" + "apikey=" + $rootScope.apikey)
                .then(function (response) {
                    console.log("Data " + data.country + " deleted!");
                    M.toast('<i class="material-icons">done</i> ' + data.country + ' has been deleted succesfully!', 4000);
                    properties = "";
                    $scope.maxPages = 1;
                    $scope.currentPage = 1;
                    refresh();
                }, function (response) {
                    M.toast('<i class="material-icons">error_outline</i> Error deleting data!', 4000);
                });
        };

        $scope.delAllData = function () {
            $http
                .delete("../api/v1/governments" + "?" + "apikey=" + $rootScope.apikey)
                .then(function (response) {
                    console.log("All data deleted!");
                    M.toast('<i class="material-icons">done</i> All data has been deleted succesfully!', 4000);
                    properties = "";
                    $scope.maxPages = 1;
                    $scope.currentPage = 1;
                    refresh();
                }, function (response) {
                    M.toast('<i class="material-icons">error_outline</i> Error deleting all data!', 4000);
                });
        };

        $scope.loadInitialData = function () {
            refresh();
            if ($scope.data.length == 0) {
                $http
                    .get("../api/v1/governments/loadInitialData" + "?" + "apikey=" + $rootScope.apikey)
                    .then(function (response) {
                        console.log("Initial data loaded");
                        M.toast('<i class="material-icons">done</i> Loaded initial data succesfully!', 4000);
                        refresh();
                    }, function (response) {
                        M.toast('<i class="material-icons">error_outline</i> Error adding initial data!', 4000);
                    });
            }
            else {
                M.toast('<i class="material-icons">error_outline</i> List must be empty to add initial data!', 4000);
                console.log("List must be empty!");
            }
        };

        refresh();

        $('#apikeyModal').modal({
            complete: function () {
                $rootScope.apikey = $scope.apikey;

                $http
                    .get("../api/v1/governments" + modifier + "?" + "apikey=" + $rootScope.apikey + "&" + properties)
                    .then(function (response) {
                        M.toast('<i class="material-icons">done</i> Api key changed successfully!', 4000);
                        $scope.maxPages = Math.max(Math.ceil(response.data.length / elementsPerPage), 1);
                        dataCache = response.data;
                        $scope.refreshPage();
                    }, function (response) {
                        $scope.maxPages = 1;
                        dataCache = {};
                        $scope.refreshPage();
                        switch (response.status) {
                            case 401:
                                M.toast('<i class="material-icons">error_outline</i> Error getting data - api key missing!', 4000);
                                break;
                            case 403:
                                M.toast('<i class="material-icons">error_outline</i> Error getting data - api key incorrect!', 4000);
                                break;
                            default:
                                M.toast('<i class="material-icons">error_outline</i> Error getting data!', 4000);
                                break;
                        }
                    });
                console.log("Api key changed!");
            }
        });

        /*$('#searchModal').modal({
            complete: function() {
                modifier = "";
                properties = "";
                if ($scope.search.country && $scope.search.year) {
                    modifier = "/" + $scope.search.country + "/" + $scope.search.year;
                }
                else if ($scope.search.country) {
                    modifier = "/" + $scope.search.country;
                }
                else if ($scope.search.year) {
                    modifier = "/" + $scope.search.year;
                }
                for (var prop in $scope.searchAdd) {
                    if ($scope.searchAdd.hasOwnProperty(prop) && prop) {
                        properties += prop + "=" + $scope.searchAdd[prop] + "&";
                    }
                }
    
                refresh();
            }
        });*/
        $('#searchModal').modal({
            complete: function () {
                modifier = "";
                properties = "";
                if ($scope.from && $scope.to) {
                    properties = "from=" + $scope.from + "&to=" + $scope.to;
                }


                M.toast('<i class="material-icons">done</i> Search done successfully!', 4000);
                refresh();
            }
        });
    }]);


