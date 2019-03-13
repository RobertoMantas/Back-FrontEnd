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

        .when("/proxy/governments", {
            templateUrl: "/frontGovernmentAPI/proxyChart.html",
            controller: "governmentsProxyChartCtrl",
        })
        .when("/cors/governments", {
            templateUrl: "/frontGovernmentAPI/corsCharts.html",
            controller: "governmentsCorsChartCtrl",
        })
        
        .when("/governments/externalApi", {
            templateUrl: "/frontGovernmentAPI/externalApi.html",
            controller: "governmentsExternalApiChartCtrl"
        })
        
        .when("/governments/externalApi2", {
            templateUrl: "/frontGovernmentAPI/externalApi2.html",
            controller: "governmentsExternalApi2ChartCtrl"
        })
        
        .when("/governments/externalApi3", {
            templateUrl: "/frontGovernmentAPI/externalApi3.html",
            controller: "governmentsExternalApi3ChartCtrl"
        })
        
        .when("/governments/externalApi4", {
            templateUrl: "/frontGovernmentAPI/externalApi4.html",
            controller: "governmentsExternalApi4ChartCtrl"
        })
        
        .when("/governments/externalApi5", {
            templateUrl: "/frontGovernmentAPI/externalApi5.html",
            controller: "governmentsExternalApi5ChartCtrl"
        })
    console.log("App initialized and configured");
});