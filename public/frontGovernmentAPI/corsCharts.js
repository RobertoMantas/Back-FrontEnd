/* global angular */
/* global Materialize */
/* global $ */
/* global google */
/* global Highcharts */

angular.module("ManagerApp").
controller("governmentsCorsChartCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (governmentsCorsChartCtrl)");


     $scope.apikey = "keyRob";
        $scope.dataEconomic = {};
        $scope.govern = {};
        var dataCacheEconomic = {};
        var dataCacheGorvern = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //G01
        $scope.increase = [];
        //G07
        $scope.year = [];
        $scope.trustGovernment = [];

      

//G05
                
     $http.get("https://sos1617-01.herokuapp.com/api/v2/startups-stats?apikey=sos161701").then(function(response){
                
                dataCacheEconomic = response.data;
                $scope.dataEconomic =dataCacheEconomic;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.increase.push(Number($scope.dataEconomic[i]["increase"]));
                }
                
                
              //Me
              
            $http.get("/api/v1/governments"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheGorvern = response.data;
                $scope.govern =dataCacheGorvern;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.year.push($scope.govern[i].country);

                    $scope.trustGovernment.push(Number($scope.govern[i].trustGovernment));
                }


                    Highcharts.chart('container',{
                        title: {
                            text: 'Integrated G01 & G07'
                        },
                        chart: {
                            type: 'column'
                        },
                        xAxis: {
                            categories: $scope.year
                        },
                        legend: {
                            layout: 'vertical',
                            floating: true,
                            backgroundColor: '#FFFFFF',
                            //align: 'left',
                            verticalAlign: 'top',
                            align: 'right',
                            y: 20,
                            x: 0
                        },
                        tooltip: {
                            formatter: function () {
                                return '<b>' + this.series.name + '</b><br/>' +
                                   this.x + ': ' + this.y;
                            }
                        },
                        series:[{
                            name: 'Trust',
                            data: $scope.trustGovernment
                        },
                        {
                            name: 'increase',
                            data: $scope.increase
                        }]
                    });});
         
     });
               

}]);