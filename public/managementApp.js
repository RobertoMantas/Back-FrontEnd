angular.module("ManagerApp", ["ngRoute"]).config(function ($routeProvider) {
    $routeProvider.when("/",
        {
            templateUrl: "group.html"
        })
        .when("/governments", {
            templateUrl: "frontGovernmentAPI/list.html",
            controller: "GovernmentListCtrl"
        })
        .when("/governments/:country/:year", {
            templateUrl: "frontGovernmentAPI/edit.html",
            controller: "CountryEditCtrl"
        })
    console.log("App initialized and configured");
});