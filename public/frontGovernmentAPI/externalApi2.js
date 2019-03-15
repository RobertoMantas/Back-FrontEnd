angular.module("ManagerApp").
controller("governmentsExternalApi2ChartCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) {
    console.log("Controller initialized (governmentsExternalApi2ChartCtrl)");
        
      
    $scope.apikey = "keyRob";
    $scope.data = {};
    var dataCache = {};
    $scope.id = [];
   $scope.year= [];
     $scope.datos = [];
    $scope.datos2 = [];
   

   
$http.get("/api/v1/governments"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCacheGovernm = response.data;
            $scope.dataGovern =dataCacheGovernm;
            
            for(var i=0; i<response.data.length; i++){
            $scope.year.push(Number($scope.dataGovern[i].year));
            }

$http.get("https://api.github.com/users").then(function(response){
            
            
        dataCache = response.data;
        $scope.data = dataCache;
        
        
       
        for(var i=0; i<$scope.dataGovern.length; i++){
            var ar=[];
            ar.push($scope.data[i].login);
            ar.push($scope.year[i]);
            
            $scope.datos2.push(ar);
        
       
       }      
      

chart = anychart.cartesian();
console.log($scope.datos2);



// add a marker seris
chart.bubble($scope.datos2);

// set chart title
chart.title("Bubble Chart");
chart.maxBubbleSize(20);
chart.minBubbleSize(10);
// set axes titles 
chart.xAxis().title("Login");
chart.yAxis().title("Year");

// draw
chart.container("chartsRoberto");
chart.draw();
});
});

}]);