$(document).ready(function() {
    new Vue({
        el: '#stats',
        data: {
            dataAPI: '',
            errormsg: '',
        },
        created: function() { // As soon as instance of Vue is created, do the ajax call and populate stats variable
            var that = this;    // !Scope -> within $.ajax(), 'this' will point to the ajax call
            $.ajax({
                url: "http://localhost:1337/api/reports/items-last-month", 
                success: function(result){
                    parseResults(result);
                    console.log(result.data);
                    that.dataAPI = result;
                },
                error: function(err) {
                    console.log(err);
                    that.errormsg = err.status + ' - ' + err.statusText;
                }            
            });
        }
    });  
    
function parseResults(result){
    var parsedResult = [];
    for(var i = 0; i < result.data.length ; i++){
        var obj = {
            x : moment(result.data[i].timestamp).format('MM DD hh:ss') ,
            y : result.data[i].value
        }
        parsedResult.push(obj);
    }
    drawChart(parsedResult, result);
}
function drawChart(parsedResult,result){
    console.log(result);
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: { 
            datasets: [{
                label:result.report,
                data: parsedResult,
                backgroundColor: "rgba(255, 255, 255, 0)",
                borderColor: "#8fcee0", 
                borderWidth: 2,
                pointBackgroundColor:"#8fcee0", 
            },
           ]
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

});