(function() {
    new Vue({
        el: '#home-app',
        data: {
            stats: '', // Initialize stats for binding
            articles : '',
            stats_errormsg: '', // Initialize error msg
            articles_errormsg: '' // Initialize error msg
        },
        created: function() { // As soon as instance of Vue is created, fill in the stats object
            var thisvue = this; // !Scope -> within $.ajax(), 'this' will point to the ajax call

            var cachedStats = JSON.parse(localStorage.getItem('stats'));
            var backThenMillis = cachedStats?cachedStats.backThenMillis:0;
            var nowMillis = new Date().getTime();
            var cachingRefreshRate = 60 * 60 * 1000; // One hour
         
            var lessThanAnHourAgo = (backThenMillis !== null) && ((nowMillis - backThenMillis) < cachingRefreshRate);            

            if(lessThanAnHourAgo) {
                thisvue.stats = cachedStats;
            }
            else {
                ajaxcall("http://localhost:1337/api/stats", function(err, result) {
                    if(err) thisvue.stats_errormsg = err;
                    else {
                         thisvue.stats = result;
                         result.backThenMillis = nowMillis;
                         localStorage.setItem('stats', JSON.stringify(result));
                    }
                });
            }

            ajaxcall("http://localhost:1337/api/services/MAM", function(err, result) {
                if(err) thisvue.articles_errormsg = err;
                else thisvue.articles = result.articles;
            });

        }

    });
})();

