(function() {
    function getDataFromOverviewForService(service) {
        servicelist = getServicesList();
        for(var i = 0; i < servicelist.length; i++) {
            if(servicelist[i].service == service) return servicelist[i];
        }
        return {
            service:"error",
        }
    }

    var service = window.location.hash.substring(1).toUpperCase();  // Get service from URL after #, ex #mam becomes MAM
    document.title = service + ' \u2013 Mijn VIAA'; // Set Title

    new Vue({
        el: '#service-detail',
        data: {
            dataAPI: '',
            dataHard: getDataFromOverviewForService(service),
            serviceslist: getServicesList(),
            errormsg: '',
        },
        methods: {
            reload: function() {
                window.location.reload();
            }
        },
        created: function() { // As soon as instance of Vue is created, do the ajax call and populate stats variable
            var thisvue = this;
            ajaxcall("http://localhost:1337/api/services/" + service, function(err, result) {
                if(err) thisvue.errormsg = err;
                else thisvue.dataAPI = result;
            });
        }
    });
})();
