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

        .when("/governments/chart", {
            templateUrl: "/frontGovernmentAPI/ChartCtrl.html",
            controller: "governmentsChartCtrl"
        })

        .when("/governments/proxy", {
            templateUrl: "/frontGovernmentAPI/proxyChart.html",
            controller: "governmentsProxyChartCtrl",
        })
        
        .when("/governments/externalapi", {
            templateUrl: "/frontGovernmentAPI/externalApi.html",
            controller: "governmentsExternalApiChartCtrl"
        })
        
        .when("/governments/about", {
            templateUrl: "about.html",
        })
        
        .when("/governments/integrations", {
            templateUrl: "integrations.html",
        })
        
        .when("/governments/analytics", {
            templateUrl: "analytics.html",
        })
        .when("/governments/chartlist", {
            templateUrl: "frontGovernmentAPI/chartlist.html",
        })
        
        .when("/families", {
            templateUrl: "frontFamiliesAPI/list.html",
            controller: "FamiliesListCtrl"
        })
    console.log("App initialized and configured");
});