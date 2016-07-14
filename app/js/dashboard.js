(function() {
    new Vue({
        el: '#dashboard',
        data: {
            

            // API / Error msg pairs
            dataStats: '',
            errmsgStats: '', 
            
            graph1: '',

            view: 'personal', // View on page load
        },
        created: function() { 
            
            // Apparently not necessary since computed property 'changes' on page load / gets fired
            //refresh(this.view, this);   // Load personal/VIAA view on this Vue instance

        },
        computed: { // Change title & reload charts for selected view
            title: function() {
                // different ajax calls go here
                refresh(this.view, this);
                return (this.view == 'personal')?'Mijn dashboard':'VIAA algemeen';
            }
        }
    });  

    // Load correct charts, do appropriate ajax calls
    function refresh(view, vueinstance){
        if(view == 'personal') {

            ajaxcall("http://localhost:1337/api/stats", function(err, result) {
                if(err) vueinstance.errmsgStats = err;
                else {
                    vueinstance.dataStats = result;
                    //var sliced = parseApiResults(result);
                    //console.log(sliced);
                    drawPieFromKvpObj('statsChart', result);
                }
            });

/*
            ajaxcall("http://localhost:1337/api/reports/items/last-month", function(err, result) {
                if(err) vueinstance.errormsg = err;
                else {
                    var results = parseApiResults(result.data);
                    drawChart('test', results, 'pie');
                }
            });
*/
            // 1. ajax call
            // 2. parseApiResults(1)
            // 3. drawChart(whichOne, 2, type)

        }
        else {

        }
    }


    // Simplify drawChartDev()
    function drawChart(id, data, type) {
        drawChartDev(id, data.x, data.y, data.title, type);
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
        };

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
                    "#239823",
                    "#fefefe",
                    "#000fff",

                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#123456",
                    "#239823",
                    "#fefefe",
                    "#000fff",
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
    }

    function drawChartDev(id, xValues, yValues, title, type){
        var ctx = document.getElementById(id);
        var myChart = new Chart(ctx, {
            type: type, // line, bar, doughnut, pie, radar, polar
            data: {
                labels: xValues,
                datasets: [{
                    label: title,
                    data: yValues,
                    backgroundColor:'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255,99,132,1)',
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
    }

})();
