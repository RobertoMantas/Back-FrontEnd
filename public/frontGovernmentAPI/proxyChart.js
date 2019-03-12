angular
    .module("ManagerApp")
    .controller("governmentsProxyChartCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "keyRob";
        $scope.dataEducation = {};
        $scope.dataWages = {};
        var dataCacheEducation = {};
        var dataCacheWages = {};
        $scope.categorias = [];
        $scope.categorias1 = [];
        //G08
        $scope.year = [];
        $scope.varied = [];
        $scope.averageWage =[];
        //G07
        $scope.year1 = [];
        $scope.trustGovernment = [];
        $scope.generosity = [];
        $scope.confidence = [];

      

//G07s
                
     $http.get("/proxy/governments").then(function(response){
                
                dataCacheEducation = response.data;
                $scope.dataEducation =dataCacheEducation;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias.push($scope.dataEducation[i].province);
                    $scope.year.push(Number($scope.dataEducation[i].year));
                    $scope.varied.push(Number($scope.dataEducation[i].varied));
                    $scope.averageWage.push(Number($scope.dataEducation[i].averageWage));
                }
                
                
              //G08
              
            $http.get("/api/v1/governments"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                dataCacheWages = response.data;
                $scope.dataWages =dataCacheWages;
                
                for(var i=0; i<response.data.length; i++){
                    $scope.categorias1.push($scope.dataWages[i].country);
                    $scope.year1.push(Number($scope.dataWages[i]["year"]));
                    $scope.trustGovernment.push(Number($scope.dataWages[i]["trustGovernment"]));
                    $scope.generosity.push(Number($scope.dataWages[i]["generosity"]));
                    $scope.confidence.push(Number($scope.dataWages[i]["confidence"]));
                }


                    Highcharts.chart('container',{
                        title: {
                            text: 'Integrated Team 03 & G08'
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
                            data: $scope.varied,
                        },
                        
                        
                        {
                            name: 'Generosity ',
                            data: $scope.generosity
                        },
                        
                        {
                            name: 'Trust Government',
                            data: $scope.trustGovernment
                        }]
                    });});
         
     });
               

}]);