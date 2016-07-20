(function() {
    var charts = [];
    var runningAjaxCalls = [];

    new Vue({
        el: '#dashboard',
        data: { 
            dataStats: {},
            progress: {},
            errormessages: [],
            graphs: getGraphsFromConfig(),
        },
        created: function() { 
            refreshView(this);
        },
        methods: {
            refreshGraph: function(graph, apiUrlId) {
                // Destroy chart
                for(var i = 0; i < charts.length; i++) {
                    if(charts[i].chart.canvas.id == graph.chartId) charts[i].destroy();
                }          
                graph.isLoading = true;         // Our lovely loading circle    
                graph.chartFormat = apiUrlId;
                drawChartFromApi(graph, graph.apiUrls[apiUrlId], this);  // Draw new chart

            },
            loadGraphCumulative: function(graph) {
                 // Destroy chart
                for(var i = 0; i < charts.length; i++) {
                    if(charts[i].chart.canvas.id == graph.chartId) charts[i].destroy();
                }  
 
                var parsedResults = parseApiResults(graph.data.data, graph.chartFormat);
                var cumulData = parsedResults.y;    // Get all values
                graph.activeView = 'cumulative';

                for(var j = 1; j < cumulData.length; j++) {
                    cumulData[j] = cumulData[j] + cumulData[j-1];
                }

                drawChart(graph.chartId, parsedResults, graph.chartTitle + ' - Cumulatief', graph.chartType);
            },
            loadGraphEffective: function(graph) {
                var parsedResult = parseApiResults(graph.data.data, graph.chartFormat);
                drawChart(graph.chartId, parsedResult, graph.chartTitle + ' - Effectief', graph.chartType);
                graph.activeView = 'effective';
            },
            numberWithSpaces: function (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "&nbsp;");
            }
        }
    });  

    // Pass an object from graphs {} and draw the chart for it
    function drawChartFromApi(graph, url, vueinstance) {
        runningAjaxCalls.push(ajaxcall(url, function(err, result) {
            if(err) vueinstance.errormessages.push(err);
            else {  
                graph.isLoading = false;
                graph.data = result;
                var parsedResult = parseApiResults(result.data, graph.chartFormat);
                drawChart(graph.chartId, parsedResult, graph.chartTitle, graph.chartType);
            }
        }));
    }

    // Refresh the whole view
    function refreshView(vueinstance){
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
        
        var theGraphs = vueinstance.graphs;

        // Put all isLoading booleans to true
        for(var item in theGraphs) {
            vueinstance.graphs[item].isLoading = true;   
        }
     
        // 'Big stats' on top
        runningAjaxCalls.push(ajaxcall("/api/stats", function(err, result) {
            if(err) vueinstance.errormessages.push(err);
            else {         
                // Translate the keys to user friendly output
                var userfriendlytextObj = {
                    "Video": result.registered.video || 0,
                    "Audio": result.registered.audio || 0,
                    "Film": result.registered.film || 0,
                    "Papier": result.registered.paper || 0,
                };

                var dataStats = {
                    "terabytes":Math.floor(result.archived.bytes/1024/1024/1024/1024),
                    "registered":result.registered.total,
                    "digitised":result.digitised.total.ok,
                    "archived":result.archived.amount,
                    
                };

                vueinstance.dataStats = dataStats;
                drawPieFromKvpObj('statsChart', userfriendlytextObj);
            }
        }));

        // Draw all graphs with API data  
        for(var graphKey in theGraphs) {        
            drawChartFromApi(theGraphs[graphKey], theGraphs[graphKey].apiUrls[0], vueinstance);
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

    // Parse time/data results from API dataset, int formatType decides the label format 
    function parseApiResults(data, formatType){
        var formatString = getFormatString(formatType);
        var parsedXes = [];
        var parsedYs = [];
        for(var i = 0; i < data.length ; i++){         
            var x = moment.unix(data[i].timestamp).format(formatString);
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
                    "#8d6e36", "#7e525f", "#94c847", "#8fcee0", "#F24313", "#e8e2bf",
                ],
                hoverBackgroundColor: [
                    "#8d6e36", "#7e525f", "#94c847", "#8fcee0", "#F24313", "#e8e2bf",          
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
                    backgroundColor:'rgba(143,206,224, 0.2)',
                    borderColor: 'rgba(143,206,224, 1)',
                    borderWidth: 2,
                    pointBackgroundColor : 'rgba(143,206,224, 1)'
                }]
            },
            options: {
                scales: {
                    xAxes: [{            
                        scaleLabel: {
                            display: true,
                            labelString: 'Datum'
                        }
                        }, ],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Aantal'
                        }
                    }]
                },

                legend: {
                    onClick : function (event, legendItem) {
                        event.preventDefault();
                    }
                }    
            }
        });

        charts.push(myChart);
    }
})();
