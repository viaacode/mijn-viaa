(function() {
    new Vue({
        el: '#stats',
        data: {
            dataAPI: '',
            errormsg: '',
        },
        created: function() { // As soon as instance of Vue is created, do the ajax call and populate stats variable
            var thisvue = this;
            ajaxcall("http://localhost:1337/api/reports/items/last-month", function(err, result) {
                if(err) thisvue.errormsg = err;
                else {
                    var results = parseApiResults(result.data);
                    drawChart(results.x, results.y, result.reportType, 'bar');
                    thisvue.dataAPI = result;
                }
            });
        }
    });  

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

    function drawChart(xValues, yValues, title, type){
        var ctx2 = document.getElementById("myChart2");
        var myChart2 = new Chart(ctx2, {
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
