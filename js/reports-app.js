$(document).ready(function() {

var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["20", "30", "40", "50", "60", "70"],
        datasets: [{
            label: '# of Votes',
            data: [50,12, 19, 3, 5, 2, 3],
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "#8fcee0", 
            borderWidth: 2,
            pointBackgroundColor:"#8fcee0",
             
        },
        {
            label: '# of Votes',
            data: [15, 4, 10, 7, 9, 13],
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "#94c847", 
            borderWidth: 2,
            pointBackgroundColor:"#94c847"   
        },
        {
            label: '# of Votes',
            data: [7, 8, 13, 7, 20, 10],
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "#7e525f", 
            borderWidth: 2,
            pointBackgroundColor:"#7e525f"   
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

var ctx2 = document.getElementById("myChart2");
var myChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: ["20", "30", "40", "50", "60", "70"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "#8fcee0", 
            borderWidth: 2,
            pointBackgroundColor:"#8fcee0" 
        },
        {
            label: '# of Votes',
            data: [15, 4, 10, 7, 9, 13],
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "#94c847", 
            borderWidth: 2,
            pointBackgroundColor:"#94c847"   
        },
        {
            label: '# of Votes',
            data: [7, 8, 13, 7, 20, 10],
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "#7e525f", 
            borderWidth: 2,
            pointBackgroundColor:"#7e525f"   
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

var ctx3 = document.getElementById("myChart3");
var myChart3 = new Chart(ctx3, {
    type: 'line',
    data: {
        labels: ["20", "30", "40", "50", "60", "70"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "#8fcee0", 
            borderWidth: 2,
            pointBackgroundColor:"#8fcee0" 
        },
        {
            label: '# of Votes',
            data: [15, 4, 10, 7, 9, 13],
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "#94c847", 
            borderWidth: 2, 
            pointBackgroundColor:"#94c847"  
        },
        {
            label: '# of Votes',
            data: [7, 8, 13, 7, 20, 10],
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderColor: "#7e525f", 
            borderWidth: 2,
            pointBackgroundColor:"#7e525f"     
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
});