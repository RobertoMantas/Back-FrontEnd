angular
    .module("ManagerApp")
    .controller("governmentsProxyChartCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "keyRob";
        $scope.dataco2 = {};
        $scope.dataGovern = {};
        var dataCacheEducation = {};
        var dataCacheWages = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //team03
        $scope.datoExterno = [];
        //Me
        $scope.year1 = [];
        $scope.trustGovernment = [];
        $scope.generosity = [];
        $scope.confidence = [];

      

//G07s
                
     $http.get("/proxy/governments").then(function(response){
                
                dataCacheEducation = response.data;
                $scope.dataco2 =dataCacheEducation;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.datoExterno.push(Number($scope.dataco2[i]["co2-metrics-tons-per-capita"]));
                }
                
                
              //G08
              
            $http.get("/api/v1/governments"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheWages = response.data;
                $scope.dataGovern =dataCacheWages;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias1.push($scope.dataGovern[i].country);
                    $scope.year1.push(Number($scope.dataGovern[i]["year"]));
                    $scope.trustGovernment.push(Number($scope.dataGovern[i]["trustGovernment"]));
                    $scope.generosity.push(Number($scope.dataGovern[i]["generosity"]));
                    $scope.confidence.push(Number($scope.dataGovern[i]["confidence"]));
                }


                    Highcharts.chart('container',{
                        title: {
                            text: 'Integrated Team 03 & Team 5'
                        },
                        chart: {
                            type: 'line'
                        },
                        xAxis: {
                            categories: $scope.categorias1

                        },
                        x2Axis: {
                            categories: $scope.categorias
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
                            name: 'year',
                            data: $scope.datoExterno,
                        },
                        
                        
                        {
                            name: 'Generosity ',
                            data: $scope.generosity
                        },
                        
                        {
                            name: 'Confidence',
                            data: $scope.confidence
                        },
                        
                        {
                            name: 'Trust Government',
                            data: $scope.trustGovernment
                        }]
                    });});
         
     });
               

}]);