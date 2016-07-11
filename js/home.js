$(document).ready(function() {

    new Vue({
        el: '#home-app',
        data: {
            stats: { }, // Initialize stats for binding
            errormsg: '' // Initialize error msg 
        },
        created: function() { // As soon as instance of Vue is created, do the ajax call and populate stats variable
            console.log("Ajax call");
            var that = this;    // !Scope -> within $.ajax(), 'this' will point to the ajax call
            $.ajax({
                url: "http://localhost:1337/api/stats", 
                success: function(result){
                    console.log(result);
                    that.stats = result;
                },
                error: function(err) {
                    console.log(err);
                    that.errormsg = err.status + ' - ' + err.statusText;
                }            
            });
        }

    });
});

