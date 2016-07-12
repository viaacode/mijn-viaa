$(document).ready(function() {

    function getDataFromOverviewForService(service) {
        servicelist = getServicesList();
        for(var i = 0; i < servicelist.length; i++) {
            if(servicelist[i].service == service) return servicelist[i];
        }
    }

    var service = window.location.hash.substring(1).toUpperCase();  // Get service from URL after #, ex #mam becomes MAM

    new Vue({
        el: '#service-detail',
        data: {
            dataAPI: '',
            dataHard: getDataFromOverviewForService(service),
            errormsg: '',
        },
        created: function() { // As soon as instance of Vue is created, do the ajax call and populate stats variable
            var that = this;    // !Scope -> within $.ajax(), 'this' will point to the ajax call
            $.ajax({
                url: "http://localhost:1337/api/services/" + service, 
                success: function(result){
                    that.dataAPI = result;
                },
                error: function(err) {
                    console.log(err);
                    that.errormsg = err.status + ' - ' + err.statusText;
                }            
            });
        }

    });

    // Set Title
    $('title').html(service + ' &ndash; Mijn VIAA');

});