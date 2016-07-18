(function() {
    var charts = [];
    var runningAjaxCalls = [];

    new Vue({
        el: '#dashboard',
        data: { 
            dataStats: '',
            errormessages: [],
            view: 'personal', // View on page load

            // Splitting everything up for now ~~
            data_1_select: 1,
            data_1_loading: false,
            data_2_select: 1,
            data_2_loading: false,



          //  graphLoading: false,   // Pass to view that loader needs to show
        },
        created: function() { 
            
            // Apparently not necessary since computed property changes when data: { view: '' } is set
            //refresh(this.view, this);   // Load personal/VIAA view on this Vue instance

        },
        computed: {
            title: function() {
                refresh(this.view, this);
                return (this.view == 'personal')?'Mijn dashboard':'VIAA algemeen';
            }
        },
    });  

    // Load correct charts, do appropriate ajax calls
    function refresh(view, vueinstance){
        // Destroy all charts
        for(var i = 0; i < charts.length; i++) {
            charts[i].destroy();
        }

        // Abort all running ajax calls (view refreshing bug)
        for(var i = 0; i < runningAjaxCalls.length; i++) {
            console.log(runningAjaxCalls[i]);
            runningAjaxCalls[i].abort();
        }

        runningAjaxCalls = [];
        vueinstance.dataStats = '';
        vueinstance.errormessages = [];

        vueinstance.data_1_loading = true;
        vueinstance.data_2_loading = true;

       // vueinstance.graphLoading = true;

        if(view == 'personal') {
            // Big general stats
            runningAjaxCalls.push(ajaxcall("http://localhost:1337/api/stats", function(err, result) {
                if(err) vueinstance.errormessages.push(err);
                else {                 
                    vueinstance.dataStats = result;                   
                    drawPieFromKvpObj('statsChart', vueinstance.dataStats);
                }
            }));

            // Last month graphs
            runningAjaxCalls.push(ajaxcall("http://localhost:1337/api/reports/items/last-month", function(err, result) {
                if(err) vueinstance.errormessages.push(err);
                else {
                    vueinstance.data_1_loading = false;
                    var parsedResult = parseApiResults(result.data);
                    drawChart('data_1_chart', parsedResult, 'Items laatste maand', 'line');
                }
            }));

            // Last week graphs
            runningAjaxCalls.push(ajaxcall("http://localhost:1337/api/reports/items/last-week", function(err, result) {
                if(err) vueinstance.errormessages.push(err);
                else {
                    vueinstance.data_2_loading = false;
                    var parsedResult = parseApiResults(result.data);
                    drawChart('data_2_chart', parsedResult, 'Items laatste week', 'line');
                }
            }));

        }
        else {
            // Do ajax calls and render graphs and stuff for VIAA general view

            // Simulate total data
            simlatedobj = {
                "terabytes":"1203",
                "items":123,
                "archive_growth":7989,
                "registration_growth":111.12,
                
            };
            vueinstance.dataStats = simlatedobj;
            drawPieFromKvpObj('statsChart', simlatedobj);
            

            // Last month graphs
            runningAjaxCalls.push(ajaxcall("http://localhost:1337/api/reports/items/last-month", function(err, result) {
                if(err) vueinstance.errormessages.push(err);
                else {
                    vueinstance.data_1_loading = false;
                    var parsedResult = parseApiResults(result.data);
                    drawChart('data_1_chart', parsedResult, 'Items laatste maand', 'bar');
                }
            }));

            // Last week graphs
            runningAjaxCalls.push(ajaxcall("http://localhost:1337/api/reports/items/last-week", function(err, result) {
                if(err) vueinstance.errormessages.push(err);
                else {
                    vueinstance.data_2_loading = false;
                    var parsedResult = parseApiResults(result.data);
                    drawChart('data_2_chart', parsedResult, 'Items laatste week', 'bar');
                }
            }));
        }
    }


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
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#123456",
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#123456",
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
                    backgroundColor:'rgba(9,160,75, 0.2)',
                    //borderColor: 'rgba(224,57,12,1)',
                    //borderColor: 'rgba(9,160,75, 1)',
                    borderColor: 'rgba(143,206,224, 1)',
                    borderWidth: 1
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
