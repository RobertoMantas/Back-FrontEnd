angular.module("ManagerApp", ["ngRoute"]).config(function ($routeProvider) {
    $routeProvider.when("/",
        {
            templateUrl: "group.html"
        })
        .when("/governments", {
            templateUrl: "frontGovernmentAPI/list.html",
            controller: "GovernmentListCtrl"
        })
    console.log("App initialized and configured");
});