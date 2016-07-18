(function() {
    var charts = [];
    var runningAjaxCalls = [];

    new Vue({
        el: '#dashboard',
        data: { 
            dataStats: '',
            errormessages: [],
            view: 'personal', // View on page load

            graphs: {
                // These objects have to match the 'view' v-model options (from dropdown)
                // Note: chartId value doesn't matter at all but has to be unique
                personal: {
                    evolutionRegistration: { 
                        dropdown: 1,
                        chartId: 'data_1_chart',
                        chartTitle: 'Evolutie Registratie',
                        chartType: 'line',
                        apiUrls: [
                            'http://localhost:1337/api/reports/items/last-week',
                            'http://localhost:1337/api/reports/items/last-month',
                            'http://localhost:1337/api/reports/items/last-year'
                        ],
                        lastApiData: {},
                        isLoading: false 
                    },
                    archiveGrowth: {
                        dropdown: 1,
                        chartId: 'data_2_chart',
                        chartTitle: 'Aangroei Archief',
                        chartType: 'line',
                        apiUrls: [
                            'http://localhost:1337/api/reports/items/last-week',
                            'http://localhost:1337/api/reports/items/last-month',
                            'http://localhost:1337/api/reports/items/last-year'
                        ],
                        lastApiData: {},
                        isLoading: false 
                    },
                },
                viaa: {
                    evolutionRegistration: {
                        dropdown: 1,
                        chartId: 'data_1_chart',
                        chartTitle: 'TEST TITLE',
                        chartType: 'bar',
                        apiUrls: [
                            'http://localhost:1337/api/reports/items/last-week',
                            'http://localhost:1337/api/reports/items/last-month',
                            'http://localhost:1337/api/reports/items/last-year'
                        ],
                        lastApiData: {},
                        isLoading: false 
                    },
                    archiveGrowth: {
                        dropdown: 1,
                        chartId: 'data_2_chart',
                        chartTitle: 'TDATA 2 TEST TITLE',
                        chartType: 'line',
                        apiUrls: [
                            'http://localhost:1337/api/reports/items/last-week',
                            'http://localhost:1337/api/reports/items/last-month',
                            'http://localhost:1337/api/reports/items/last-year'
                        ],
                        lastApiData: {},
                        isLoading: false 
                    }
                }
            }
        },
        created: function() { 
            
            // Apparently not necessary since computed property changes when data: { view: '' } is set
            //refresh(this.view, this);   // Load personal/VIAA view on this Vue instance

        },
        computed: {
            title: function() {
                refreshView(this.view, this);
                return (this.view == 'personal')?'Mijn dashboard':'VIAA algemeen';
            },

        },
        methods: {
            refreshGraph: function(graph, e) {
                // Destroy chart
                for(var i = 0; i < charts.length; i++) {
                    if(charts[i].chart.canvas.id == graph.chartId) charts[i].destroy();
                }
                graph.isLoading = true;         // Our lovely loading circle
                drawChartFromApi(graph, graph.apiUrls[e.target.value], this);  // Draw new chart
            }
        }
    });  


    // Pass an object from graphs {} and draw the chart for it
    function drawChartFromApi(item, url, vueinstance) {
        runningAjaxCalls.push(ajaxcall(url, function(err, result) {
            if(err) vueinstance.errormessages.push(err);
            else {  
                item.isLoading = false;
                var parsedResult = parseApiResults(result.data);
                drawChart(item.chartId, parsedResult, item.chartTitle, item.chartType);
            }
        }));
    }

    // Refresh the whole view
    function refreshView(view, vueinstance){
        // Destroy all charts
        for(var i = 0; i < charts.length; i++) {
            charts[i].destroy();
        }

        // Abort all running ajax calls (view refreshing bug)
        for(var j = 0; j < runningAjaxCalls.length; j++) {
            runningAjaxCalls[j].abort();
        }

        // Clean the view
        runningAjaxCalls = [];
        vueinstance.dataStats = '';
        vueinstance.errormessages = [];
        
        var graphsForView = vueinstance.graphs[view];

        // Put all isLoading booleans to true
        for(var item in graphsForView) {
            vueinstance.graphs[view][item].isLoading = true;   
        }
     
        // 'Big stats' on top
        if(view == 'personal') {
            runningAjaxCalls.push(ajaxcall("http://localhost:1337/api/stats", function(err, result) {
                if(err) vueinstance.errormessages.push(err);
                else {         
                    // Translate the keys to user friendly output
                    var userfriendlytextObj = {
                        "Terabytes": result.terabytes,
                        "Items": result.items,
                        "Archive Growth": result.archive_growth,
                        "Registration Growth": result.registration_growth      
                    } 
                    vueinstance.dataStats = result;                   
                    drawPieFromKvpObj('statsChart', userfriendlytextObj);
                }
            }));
        }
        else {
            var simulatedObj = {
                "terabytes":250,
                "items":150,
                "archive_growth":50,
                "registration_growth":550,
            };
            
            // Translate the keys to user friendly output
            var userfriendlytextObj = {
                "Terabytes": simulatedObj.terabytes,
                "Items": simulatedObj.items,
                "Archive Growth": simulatedObj.archive_growth,
                "Registration Growth": simulatedObj.registration_growth
            }
            vueinstance.dataStats = simulatedObj;
            drawPieFromKvpObj('statsChart', userfriendlytextObj);
        }

        // Draw all graphs with API data  
        for(var graphKey in graphsForView) {        
            drawChartFromApi(graphsForView[graphKey], graphsForView[graphKey].apiUrls[0], vueinstance);
        }
    }


    /*************************************
     * ***  Chart drawing and stuff    ***
     * ***********************************
     */

    // Simplify drawChartDev()
    function drawChart(id, data, title, type) {
        drawChartDev(id, data.x, data.y, title, type);
    }

    // Parse time/data results from API dataset
    function parseApiResults(data){
        var parsedXes = [];
        var parsedYs = [];
        for(var i = 0; i < data.length ; i++){         
            var x = moment.unix(data[i].timestamp).format('MM DD hh:ss');
            var y = data[i].value;
            parsedXes.push(x);
            parsedYs.push(y);
        }

        return { x: parsedXes, y: parsedYs };
    }

    // Split object key/values and draw them on piechart #id
    function drawPieFromKvpObj(id, obj) {
        var ctx = document.getElementById(id);

        var keys = [];
        var vals = [];

        for(var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
                vals.push(obj[key]);
            }
        }

        var data = {
            labels: keys,
            datasets: [{
                data: vals,
                backgroundColor: [
                    "#8d6e36",
                    "#7e525f",
                    "#94c847",
                    "#8fcee0",
                    "#F24313",
                    "#e8e2bf",
                    
                ],
                hoverBackgroundColor: [
                    "#8d6e36",
                    "#7e525f",
                    "#94c847",
                    "#8fcee0",
                    "#F24313",
                    "#e8e2bf",
                    
                ]
            }]
        };

        var myChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                legend: {
                    display:false    // legend above chart
                },
         
            }
        });     

        charts.push(myChart);  
    }

    // Draw a chart on <canvas id="#id"> with xValues & yValues, title on top
    // chart types: line, bar, doughnut, pie, radar, polar
    function drawChartDev(id, xValues, yValues, title, type){
        var ctx = document.getElementById(id);
        var myChart = new Chart(ctx, {
            type: type, 
            data: {
                labels: xValues,
                datasets: [{
                    label: title,
                    data: yValues,
                    //backgroundColor:'rgba(143,206,224, 0.2)',
                    backgroundColor:'rgba(143,206,224, 0.2)',
                    //borderColor: 'rgba(224,57,12,1)',
                    //borderColor: 'rgba(9,160,75, 1)',
                    borderColor: 'rgba(143,206,224, 1)',
                    borderWidth: 2,
                    pointBackgroundColor : 'rgba(143,206,224, 1)'
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                            type: "time",
                            time: {
                                format: 'MM DD',
                                // round: 'day'
                                tooltipFormat: 'll HH:mm'
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Date'
                            }
                        }, ],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'value'
                        }
                    }]
                }
            }
        });

        charts.push(myChart);
    }

})();
