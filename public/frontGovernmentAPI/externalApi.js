angular.module("ManagerApp").
    controller("governmentsExternalApiChartCtrl", ["$scope", "$http", "$rootScope", function ($scope, $http, $rootScope) {
        console.log("Controller initialized (governmentsExternalApiChartCtrl)");

        $scope.apikey = "keyRob";
        $scope.data = {};
        var dataCache = {};
        $scope.nombrePais = [];
        $scope.population = [];
        $scope.area = [];

        $http.get("https://restcountries.eu/rest/v1/all").then(function (response) {


            dataCache = response.data;
            $scope.data = dataCache;

            for (var i = 0; i < response.data.length; i++) {
                $scope.nombrePais.push($scope.data[i].name);
                $scope.population.push(Number($scope.data[i].population));
                $scope.area.push(Number($scope.data[i].area));
            }
            //Google
            google.charts.load('current', {
                'packages': ['controls', 'geochart']
            });
            google.charts.setOnLoadCallback(drawRegionsMap);


            function drawRegionsMap() {
                var myData = [['Country', 'Population', 'Area']];

                response.data.forEach(function (d) {

                    myData.push([(d.name), Number(d.area), Number(d.population)]);

                });
                var data = google.visualization.arrayToDataTable(myData);
                var options = {
                    region: '150',
                    colorAxis: { colors: ['blue', 'green', 'purple'] }
                };
                var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard'));

                var populationAreaSelector = new google.visualization.ControlWrapper({
                    controlType: 'CategoryFilter',
                    containerId: 'filter',
                    options: {
                        filterColumnIndex: 0,
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
                        colorAxis: { colors: ['blue', 'green', 'purple'] }
                    }
                });
                dashboard.bind(populationAreaSelector, chart);
                dashboard.draw(data, options);
            }

        });


        $scope.apikey = "keyRob";
        $scope.data = {};
        var dataCache = {};
        $scope.id = [];
        $scope.governments = [];
        $scope.datos = [];
        $scope.datos2 = [];



        $http.get("/api/v1/governments" + "?" + "apikey=" + $scope.apikey).then(function (response) {

            dataCacheGovern = response.data;
            $scope.dataGovern = dataCacheGovern;

            for (var i = 0; i < response.data.length; i++) {
                $scope.governments.push(Number($scope.dataGovern[i].confidence));
            }
            $http.get("https://api.tvmaze.com/search/people?q=lauren").then(function (response) {

                dataCache = response.data;
                $scope.data = dataCache;



                for (var i = 0; i < $scope.dataGovern.length; i++) {
                    var ar = [];
                    $scope.datos2.push({ "confidence": $scope.governments[i], "score": $scope.data[i].score });


                }

                chart = AmCharts.makeChart("apiext2", {
                    "type": "serial",
                    "theme": "dark",
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
                    "categoryField": "score",
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




        $scope.apikey = "keyRob";
        $scope.data2 = {};
        $scope.data21 = {};
        var dataCache = {};
        var dataCache1 = {};
        $scope.id = [];
        $scope.datos = [];

        $scope.name = [];
        $scope.trustGovernment = [];
        $scope.country = [];
        $scope.confidence = [];

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        $http.get("/api/v1/governments/" + "?" + "apikey=" + $scope.apikey).then(function (response) {

            dataCache1 = response.data;
            $scope.data21 = dataCache1;

            for (var i = 0; i < response.data.length; i++) {
                $scope.datos.push(capitalizeFirstLetter($scope.data21[i].country) + " " + $scope.data21[i].year);
                $scope.trustGovernment.push(Number($scope.data21[i].trustGovernment));
                $scope.confidence.push(Number($scope.data21[i].confidence));
                $scope.country.push(Number($scope.data21[i].country));
            }


            $http.get("https://data.police.uk/api/leicestershire/neighbourhoods").then(function (response) {


                dataCache = response.data;
                $scope.data2 = dataCache;


                for (var i = 0; i < response.data.length; i++) {

                    $scope.id.push($scope.data2[i].id);
                    $scope.name.push($scope.data2[i].name);



                }




                //ZingChart
                var myConfig = {
                    "type": "area3d",

                    "backgroundColor": 'black',
                    "title": {
                        "text": "Police data vs confidence",
                        "fontColor": 'red',
                        "font-size": "24px",
                        "adjust-layout": true
                    },
                    "plotarea": {
                        "margin": "dynamic 45 60 dynamic",
                    },

                    "legend": {
                        "layout": "float",
                        "background-color": "none",
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
                            "text": "Movies",
                            "fontColor": "green",

                        },
                        "labels":
                            $scope.name

                    },
                    "scale-y": {
                        "min-value": "0:2020",
                        "label": {
                            "text": "Release Year",
                            "fontColor": 'green',

                        },

                    },

                    "crosshair-x": {
                        "line-color": 'purple',
                        "plot-label": {
                            "border-radius": "5px",
                            "border-width": "1px",
                            "border-color": "#f6f7f8",
                            "padding": "10px",
                            "font-weight": "bold"
                        },
                        "scale-label": {
                            "font-color": "#000",
                            "background-color": 'green',
                            "border-radius": "5px"
                        }
                    },

                    "tooltip": {
                        "visible": false
                    },

                    "plot": {
                        "highlight": true,
                        "tooltip-text": "%t views: %v<br>%k",
                        "shadow": 0,
                        "line-width": "2px",
                        "marker": {
                            "type": "circle",
                            "size": 3
                        },
                        "highlight-state": {
                            "line-width": 3
                        },
                        "animation": {
                            "effect": 1,
                            "sequence": 2,
                            "speed": 100,
                        }
                    },

                    "series": [
                        {
                            "values": $scope.id,
                            "text": "id Police UK",
                            "line-color": 'green',
                            "legend-item": {
                                "background-color": "#007790",
                                "borderRadius": 5,
                                "font-color": "white"
                            },


                        }, {
                            "values": $scope.confidence,
                            "text": "confidence per year",
                            "line-color": "#6EFF33",
                            "legend-item": {
                                "background-color": "#6EFF33",
                                "borderRadius": 7,
                                "font-color": "black"
                            },


                            "legend-marker": {
                                "visible": false
                            },

                            "marker": {
                                "background-color": "#FEB32E",
                                "border-width": 1,
                                "shadow": 0,
                                "border-color": "#69f2d0"
                            },
                            "highlight-marker": {
                                "size": 6,
                                "background-color": "#FEB32E",
                            }
                        }
                    ]
                };

                zingchart.render({
                    id: 'RobertoChart',
                    data: myConfig,
                    height: '95%',
                    width: '90%'
                });
            });
        });


        $scope.apikey = "keyRob";
        $scope.data4 = {};
        var dataCache = {};
        $scope.id = [];
        $scope.confidence2 = [];
        $scope.datos = [];
        $scope.datos3 = [];



        $http.get("/api/v1/governments" + "?" + "apikey=" + $scope.apikey).then(function (response) {

            dataCacheGovernm = response.data;
            $scope.data4Govern = dataCacheGovernm;

            for (var i = 0; i < response.data.length; i++) {
                $scope.confidence2.push(Number($scope.data4Govern[i].confidence));
            }

            $http.get("https://api.github.com/users").then(function (response) {


                dataCache = response.data;
                $scope.data4 = dataCache;



                for (var i = 0; i < $scope.data4Govern.length; i++) {
                    var ar = [];
                    ar.push($scope.data4[i].login);
                    ar.push($scope.confidence2[i]);

                    $scope.datos3.push(ar);


                }


                chart = anychart.cartesian();
                console.log($scope.datos3);



                // add a marker seris
                chart.bubble($scope.datos3);

                // set chart title
                chart.title("Github users & Confidence");
                chart.maxBubbleSize(40);
                chart.minBubbleSize(10);
                // set axes titles 
                chart.xAxis().title("Github Users");
                chart.yAxis().title("Confidence");

                // draw
                chart.container("chartsRoberto");
                chart.draw();
            });
        });

    }]);