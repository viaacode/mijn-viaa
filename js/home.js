$(document).ready(function() {
    new Vue({
        el: '#home-app',
        data: {
            stats: '', // Initialize stats for binding
            errormsg: '' // Initialize error msg 
        },
        created: function() { // As soon as instance of Vue is created, fill in the stats object
            var nowMillis = new Date().getTime();
            var cachedStats = JSON.parse(localStorage.getItem('stats'));
            var backThenMillis = cachedStats.backThenMillis;
            var refreshRate = 60 * 60 * 1000; // One hour
            var lessThanAnHourAgo = backThenMillis !== null && ((nowMillis - backThenMillis) < refreshRate);

            if(lessThanAnHourAgo) {
                this.stats = cachedStats; 
            } 
            else {                
                var that = this; // !Scope -> within $.ajax(), 'this' will point to the ajax call
                $.ajax({
                    url: "http://localhost:1337/api/stats", 
                    success: function(result){
                        // Save time to localstorage when this ajax call is made
                        result.backThenMillis = nowMillis;  
                        localStorage.setItem('stats', JSON.stringify(result));
                        that.stats = result;
                    },
                    error: function(err) {
                        console.log(err);
                        that.errormsg = err.status + ' - ' + err.statusText;
                    }            
                });
            }
        }

    });
});

