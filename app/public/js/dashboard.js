(function() {
    var charts = [];
    var runningAjaxCalls = [];

    new Vue({
        el: '#dashboard',
        data: { 
            dataStats: '',
            errormessages: [],
            view: 'personal', // View on page load
            graphs: getGraphsFromConfig(),
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
                    };
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
            };
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

    // Parse time/data results from API dataset, int formatType decides the label format 
    function parseApiResults(data, formatType){
        var formatString = getFormatString(formatType);
        var parsedXes = [];
        var parsedYs = [];
        for(var i = 0; i < data.length ; i++){         
            var x = moment.unix(data[i].timestamp).format(formatString);
           // var x = moment(data[i].timestamp, formatString);
           // var x = data[i].timestamp;
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
                }
            }
        });

        charts.push(myChart);
    }

})();
