angular
    .module("ManagerApp")
    .controller("governmentsChartCtrl",["$scope","$http",function ($scope, $http){
        
        $scope.apikey = "keyRob";
        $scope.data = {};
        var dataCache = {};
        $scope.datos = [];
        $scope.trustGovernment= [];
        $scope.generosity = [];
        $scope.confidence = [];
        $scope.year = [];
        
        function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        
        $http.get("/api/v1/governments/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.datos.push(capitalizeFirstLetter($scope.data[i].country) + " " + $scope.data[i].year);
                $scope.generosity.push(Number($scope.data[i].generosity));
                $scope.trustGovernment.push(Number($scope.data[i].trustGovernment));
                $scope.confidence.push(Number($scope.data[i].confidence));
            }
        });    
            
        console.log("Graph Controller initialized");
        $http.get("/api/v1/governments/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            
           Highcharts.chart('container1', {
    chart: {
        type: 'areaspline'
    },
    title: {
        text: 'Trust governments in some years'
    },
    xAxis: {
        categories: $scope.datos
    },
    yAxis: {
        min: 0,
        title: {
            text: 'governments'
        }
    },
    legend: {
        reversed: true
    },
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },
    series: [{
        name: 'trustGovernment',
        data: $scope.trustGovernment
    }
     , {
        name: 'generosity',
        data: $scope.generosity
    }
    // , {
    //     name: 'confidence',
    //     data: $scope.confidence
    // }
]
});

Highcharts.chart('container2', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Government Stat'
    },
   
    xAxis: {
        categories: $scope.datos,
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Rate'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'trustGovernment',
        data: $scope.trustGovernment

    }, {
        name: 'generosity',
        data: $scope.generosity

    },
     {
            name: 'confidence',
             data: $scope.confidence
         }]
});
            
        
           
            
            
            //Google
            google.charts.load('current', {
                'packages': ['controls','geochart']
            });
            google.charts.setOnLoadCallback(drawRegionsMap);
                        
        
            function drawRegionsMap() {
                var myData = [['Country','trustGovernment', 'Year']];
     
                response.data.forEach(function (d){
                    myData.push([capitalizeFirstLetter(d.country), Number(d.trustGovernment), Number(d.year)]);
                });
                    
                var data = google.visualization.arrayToDataTable(myData);
                var options = {
                    region: '150',
                    colorAxis: {colors: ['blue', 'green' , 'purple']}
                };
                var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard'));

                var yearSelector = new google.visualization.ControlWrapper({
                    controlType: 'CategoryFilter',
                    containerId: 'filter',
                    options: {
                        filterColumnIndex: 2,
                        ui: {
                            allowTyping: false,
                            allowMultiple: true,
                            allowNone: false
                        }
                    }
                });
                var chart = new google.visualization.ChartWrapper({
                    chartType: 'GeoChart',
                    containerId: 'map',
                    options: {
                        displayMode: 'regions',
                        colorAxis: {colors: ['blue', 'green' , 'purple']}
                    }
                });
                dashboard.bind(yearSelector, chart);
                dashboard.draw(data, options);
            }    



function datos(){
      var ret=[];
      
     response.data.forEach(function(d){
         response.data.country=d.country;
         response.data.year=d.year;
         response.data.trustGovernment=d.trustGovernment;
         response.data.generosity=d.generosity;
         
          ret.push({"country":response.data.country,
          "year":response.data.year,
          "trustGovernment":response.data.trustGovernment,
          "generosity":response.data.generosity,
          });
          });
     
      return ret;
     
  }
new Morris.Bar({
    
  // ID of the element in which to draw the chart.
  element: 'chartGovernment',
  // Chart data records -- each entry in this array corresponds to a point on
  // the chart.
  
  data: datos(),
  // The name of the data record attribute that contains x-values.
  xkey: ['country'],
  // A list of names of data record attributes that contain y-values.
  ykeys: ['generosity','trustGovernment'],
  // Labels for the ykeys -- will be displayed when you hover over the
  // chart.
  labels: ['Generosity','Trust on Government']
});


  //Zing-Charts
  var myZingChart = {
    "type": "line",
    
    "backgroundColor":'#FCFCFB',
    "title": {
        "text": "ZingCharts",
        "fontColor":"#FFFFF",
        "font-size": "50px",
        "adjust-layout": true,
    },
    "plotarea": {
        "margin": "dynamic 45 60 dynamic",
    },
    
    "legend": {
        "layout": "float",
        "background-color": "white",
        "border-width": 0,
        "shadow": 0,
        "align": "center",
        "adjust-layout": true,
    "item": {
        "padding": 7,
        "marginRight": 17,
        "cursor": "hand"
    }
    },
    
    "scale-x": {
        "label": {
            "text": "Province and Year",
            "fontColor":"#A6FF8F"   ,

        },
        "labels": 
            $scope.datos
        
    },
    "scale-y": {
        "min-value": "0:1383292800000",
        "label": {
            "text": "Cuantity",
            "fontColor":"#A6FF8F",

        },
        
    },
    
    "crosshair-x": {
        "line-color": "#efefef",
        "plot-label": {
        "border-radius": "5px",
        "border-width": "1px",
        "border-color": "#0680FA",
        "padding": "10px",
        "font-weight": "bold"
    },
    "scale-label": {
        "font-color": "#000",
        "background-color": "#C133FF",
        "border-radius": "10px"
    }
},
    
    "tooltip": {
        "visible": false
    },
    
    "plot": {
        "highlight": true,
        "tooltip-text": "%t views: %v<br>%k",
        "shadow": 0,
        "line-width": "4px",
        "marker": {
        "type": "square",
        "size": 3
    },
    "highlight-state": {
    "line-width": 3
    },
    "animation": {
        "effect": 3,
        "sequence": 4,
        "speed": 800,
    }
    },
    
    "series": [
    {
        "values": $scope.trustGovernment,
        "text": "Trust Government",
        "line-color": "#FF3333",
        "legend-item":{
          "background-color": "#FF3333",
          "borderRadius":7,
          "font-color":"black"
        },
        "legend-marker": {
            "visible":false
        },
        "marker": {
            "background-color": "#F0FF33",
            "border-width": 1,
            "shadow": 0,
            "border-color": "#69dbf1"
        },
        "highlight-marker":{
          "size":6,
          "background-color": "#F0FF33",
        }
    },
    {
        "values": $scope.generosity,
        "text": "Generosity per year",
        "line-color": "#6EFF33",
        "legend-item":{
          "background-color": "#6EFF33",
          "borderRadius":7,
          "font-color":"black"
        },
        "legend-marker": {
            "visible":false
        },
        "marker": {
            "background-color": "#FEB32E",
            "border-width": 1,
            "shadow": 0,
            "border-color": "#69f2d0"
        },
        "highlight-marker":{
          "size":6,
          "background-color": "#FEB32E",
        }
    },
    {
        "values": $scope.confidence,
        "text": "Confidence per year",
        "line-color": "#4169E1",
        "legend-item":{
          "background-color": "#4169E1",
          "borderRadius":7,
          "font-color":"black"
        },
        "legend-marker": {
            "visible":false
        },
        "marker": {
            "background-color": "#FEB32E",
            "border-width": 1,
            "shadow": 0,
            "border-color": "#69f2d0"
        },
        "highlight-marker":{
          "size":6,
          "background-color": "#FEB32E",
        }
    }
]
};

zingchart.render({
    id: 'RobertoChart',
    data: myZingChart,
    width: '100%'
});

});
            }]);
  
   
                  
          