(function() {
    var charts = [];
    var runningAjaxCalls = [];
    var windowWidth = window.innerWidth;

    new Vue({
        el: '#dashboard',
        data: { 
            dataStats: {},
            dataPieChartStats: {},
            dataPieChartColors: ["#006495","#004C70", "#0093D1","#F2635F", "#F4D00C", "#E0A025", "#FF0000", "#666666", "#FF9900"],
            dataErrors: [],
            progress: {},
            progressErrors: [],
            graphs: getGraphsFromConfig()
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

                var parsedResults = parseApiResults(graph.data, graph.chartFormat);
                var cumulData = parsedResults.y;    // Get all values
                graph.activeView = 'cumulative';

                for(var j = 1; j < cumulData.length; j++) {
                    cumulData[j] = cumulData[j] + cumulData[j-1];
                }
                var labelX = 'Datum';
                var labelY = (graph.what == 'bytes' ? 'Aantal terabytes' : 'Aantal items');

                drawChart(graph.chartId, parsedResults, graph.chartTitle + ' - Cumulatief', graph.chartType, labelX, labelY);
            },
            loadGraphEffective: function(graph) {
                // Destroy chart
                for(var i = 0; i < charts.length; i++) {
                    if(charts[i].chart.canvas.id == graph.chartId) charts[i].destroy();
                }

                var labelX = 'Datum';
                var labelY = (graph.what == 'bytes' ? 'Aantal terabytes' : 'Aantal items');

                var parsedResult = parseApiResults(graph.data, graph.chartFormat);
                drawChart(graph.chartId, parsedResult, graph.chartTitle + ' - Effectief', graph.chartType, labelX, labelY);
                graph.activeView = 'effective';
            },
            numberWithSpaces: function (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, seperationString);
            },
            getColor: function (index) {
                return this.dataPieChartColors[index];
            },
            getGraphsSize: function () {
                return Object.keys(this.graphs).length;
            },
            getWeekLabel: function () {
                if (windowWidth < 900) return 'Week';
                else return 'Afgelopen week';
            },
            getMonthLabel: function () {
                if (windowWidth < 900) return 'Maand';
                else return 'Afgelopen maand';
            },
            getYearLabel: function () {
                if (windowWidth < 900) return 'Jaar';
                else return 'Afgelopen jaar';
            },
            getAllTimeLabel: function () {
                if (windowWidth < 900) return 'All-time';
                else return 'All-time';
            }
        }
    });  

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

        var theGraphs = vueinstance.graphs;

        // Put all isLoading booleans to true
        for(var item in theGraphs) {
            vueinstance.graphs[item].isLoading = true;   
        }
     
        // 'Big stats' on top
        runningAjaxCalls.push(ajaxcall("/api/stats", function(err, result) {
            if(err) { vueinstance.dataErrors.push(err); }
            else {         
                dataErrors = [];
                vueinstance.progress = result; // For loader (?)

                var dataPieChartStats = {};

                // Loop through all mime-types that are archived
                for (var mime_type in result.archived) {
                    if (!isMimeTypeExcluded(mime_type) && result.archived[mime_type].amount.ok !== 0) {
                        dataPieChartStats[mime_type] = result.archived[mime_type].amount.ok;
                    }
                }

                vueinstance.dataPieChartStats = dataPieChartStats;

                drawPieFromKvpObj('statsChart', dataPieChartStats, vueinstance.dataPieChartColors);

                var dataStats = {
                    "terabytes": (result.archived.total.bytes.ok/1024/1024/1024/1024).toFixed(2),
                    "registered":result.registered.total,
                    "digitised":result.digitised.total.ok,
                    "archived":result.archived.total.amount.ok
                };

                vueinstance.dataStats = dataStats;
                drawProgressChart(vueinstance.progress);
            }
        }));

        // Draw all graphs with API data  
        for(var graphKey in theGraphs) {        
            drawChartFromApi(theGraphs[graphKey], theGraphs[graphKey].apiUrls[theGraphs[graphKey].chartFormat], vueinstance);
        }        
    }

    // Pass an object from graphs {} and draw the chart for it
    function drawChartFromApi(graph, url, vueinstance) {
        graph.errormessages = [];
        runningAjaxCalls.push(ajaxcall(url, function(err, result) {
            if(err) graph.errormessages.push(err);
            else {  
                graph.isLoading = false;
                console.log(result);
                // Bytes or items
                graph.data = result.data[result.what];

                if (result.what == 'bytes') {
                    // change to tgraph.databytes
                    for (var i=0; i<graph.data.length; i++) {
                        graph.data[i].y = graph.data[i].y/1024/1024/1024/1024;
                    }
                }
                if(graph.activeView == 'effective') vueinstance.loadGraphEffective(graph);
                else  vueinstance.loadGraphCumulative(graph);
            }
        }));
    }

    /*************************************
     * ***  Chart drawing and stuff    ***
     * ***********************************
     */

    // Simplify drawChartDev()
    function drawChart(id, data, title, type, labelX, labelY) {
        drawChartDev(id, data.x, data.y, title, type, labelX, labelY);
    }

    // Parse time/data results from API dataset, int formatType decides the label format 
    function parseApiResults(data, formatType){
        var formatString = getFormatString(formatType);
        var parsedXes = [];
        var parsedYs = [];
        for(var i = 0; i < data.length ; i++){         
            var x = moment.unix(data[i].x).format(formatString);
            var y = data[i].y;
            parsedXes.push(x);
            parsedYs.push(y);
        }
        return { x: parsedXes, y: parsedYs };
    }

    // Split object key/values and draw them on piechart #id
    function drawPieFromKvpObj(id, obj, colors) {
        var ctx = document.getElementById(id);
        var keys = [];
        var vals = [];
        var backgroundColorList = colors;
        var backgroundColor = [];
        var hoverBackgroundColorList = colors;
        var hoverBackgroundColor = [];

        var padding = 35;

        if (windowWidth < 930) {
            padding = 10;
        }

        var i = 0;
        for(var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key.charAt(0).toUpperCase() + key.slice(1));
                vals.push(obj[key]);
                backgroundColor.push(backgroundColorList[i]);
                hoverBackgroundColor.push(hoverBackgroundColorList[i]);
                i++;
                // when overflow
                i = (i % backgroundColorList.length);
            }
        }

        var data = {
            labels: keys,
            datasets: [{
                data: vals,
                backgroundColor: backgroundColor,
                hoverBackgroundColor: hoverBackgroundColor
            }]
        };

        var myChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                legend: {
                    display: true,    // legend above chart
                    position: 'right',
                    labels: {
                        padding: padding
                    }
                },
            }
        });     

        charts.push(myChart);  
    }

    // Draw a chart on <canvas id="#id"> with xValues & yValues, title on top
    // chart types: line, bar, doughnut, pie, radar, polar
    function drawChartDev(id, xValues, yValues, title, type, labelX, labelY){
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
                            labelString: labelX,
                            fontColor: '#111',  
                            fontStyle: 'bold',   
                        }
                        }, ],
                    yAxes: [{
                        gridLines: {
                            display:false,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: labelY,
                            fontColor: '#111',
                            fontStyle: 'bold',
                        }
                    }]
                },
                
                legend: {
                    display: false,
                }    
            }
        });

        charts.push(myChart);
    }

    function drawProgressChart(progress) {
        var ctx = document.getElementById("progress");
        
        var padding = 50;

        if (windowWidth < 500) {
            padding = 10;
        }

        var barOptions_stacked = {
            tooltips: {
                enabled: true,
                mode: 'label'
            },
            hover: {
                animationDuration:0
            },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero:true
                    },
                    scaleLabel:{
                        display:true,
                        labelString: 'Items'
                    }, 
                    stacked: true,
                }],
                yAxes: [{
                    gridLines: {
                        display:false,
                        color: "#fff",
                        zeroLineColor: "#fff",
                        zeroLineWidth: 0
                    },
                    scaleLabel:{
                        display:false
                    },
                    stacked: true
                }]
            },
            legend:{
                display: true,
                labels: {
                    padding: padding
                }
            }
    };

        var myChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: ["Video", "Audio", "Film", "Kranten", "Total"],
                
                datasets: [
                    {
                        data: [ progress.registered.video || 0, progress.registered.audio || 0,
                                progress.registered.film || 0, progress.registered.kranten || 0,
                                progress.registered.total || 0 ],
                        backgroundColor: "rgba(143, 206, 224, 1)",
                        hoverBackgroundColor: "rgba(143, 206, 224, 0.9)",
                        label:"Geregistreerd",
                    }, 
                    {
                        data: [ progress.digitised.video.ok || 0, progress.digitised.audio.ok || 0,
                                progress.digitised.film.ok || 0, progress.digitised.paper.ok || 0,
                                progress.digitised.total.ok || 0 ],
                        backgroundColor: "rgba(148, 200, 71, 1)",
                        hoverBackgroundColor: "rgba(148, 200, 71, 0.9)",
                        label:"Gedigitaliseerd",
                    },
                    {
                        data: [ progress.digitised.video.nok || 0, progress.digitised.audio.nok || 0,
                                progress.digitised.film.nok || 0, progress.digitised.paper.nok || 0,
                                progress.digitised.total.nok || 0 ],
                        backgroundColor: "rgba(233,77,24,1)",
                        hoverBackgroundColor: "rgba(233,77,24,0.9)",
                        label:"Niet-gedigitaliseerd",
                    },
                ]
            },

            options: barOptions_stacked,
        });
        charts.push(myChart);
    }




})();
