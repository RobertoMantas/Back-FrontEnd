angular
    .module("ManagerApp")
    .controller("governmentsProxyChartCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "keyRob";
        $scope.dataco2 = {};
        $scope.dataGovern = {};
        var dataCacheCo2 = {};
        //team03
        $scope.datos2 = [];

        //Me
        $scope.governments = [];
   

                

  
 


     $http.get("/api/v1/governments" + "?" + "apikey=" + $scope.apikey).then(function (response) {

         dataCacheGovern = response.data;
         $scope.dataGovern = dataCacheGovern;

         for (var i = 0; i < response.data.length; i++) {
             $scope.governments.push(Number($scope.dataGovern[i].confidence));
         }
        
             $http.get("/proxy/governments").then(function(response){
                
                dataCacheCo2 = response.data;
                $scope.dataco2 =dataCacheCo2;
                
                for (var i = 0; i < $scope.dataGovern.length; i++) {
                    $scope.datos2.push({ "confidence": $scope.governments[i], "co2Gaseous": $scope.dataco2[i]["co2-from-gaseous-fuel-consumption"] });

                }
                

             chart = AmCharts.makeChart("apiproxy", {
                 "type": "serial",
                 "theme": "light",
                 "dataProvider": $scope.datos2,
                 "valueAxes": [{
                     "gridColor": "#FFFFFF",
                     "gridAlpha": 0.2,
                     "dashLength": 0
                 }],
                 "gridAboveGraphs": true,
                 "startDuration": 1,
                 "graphs": [{
                     "balloonText": "[[category]]: <b>[[value]]</b>",
                     "fillAlphas": 0.8,
                     "lineAlpha": 0.2,
                     "type": "column",
                     "valueField": "confidence"
                 }],
                 "chartCursor": {
                     "categoryBalloonEnabled": false,
                     "cursorAlpha": 0,
                     "zoomable": false
                 },
                 "categoryField": "co2Gaseous",
                 "categoryAxis": {
                     "gridPosition": "start",
                     "gridAlpha": 0,
                     "tickPosition": "start",
                     "tickLength": 20
                 },
                 "export": {
                     "enabled": true
                 }

             });
         });
     });



}]);