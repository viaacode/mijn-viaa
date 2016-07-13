(function() {

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
            var that = this;
            var r = new XMLHttpRequest();
            r.open("GET", "http://localhost:1337/api/services/" + service, true);
            r.onreadystatechange = function () {
                console.log(r.status);
                // We have to know possible error statuses now to catch them
                if(r.status == 400 || r.status == 404 || r.status == 500) {
                    that.errormsg = r.responseText;
                    return;
                }
                if (r.readyState != 4 || r.status != 200) {
                    return;
                }
                else that.dataAPI = JSON.parse(r.responseText);
            }
            r.send();
        }

    });

    // Set Title
    window.title = service + ' &ndash; Mijn VIAA';

})();