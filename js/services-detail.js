$(document).ready(function() {

    function getDummyData() {
        return {
            "service": "MAM",
            "stats": [
                {
                "key": "archivedData",
                "value": 11,
                "unit": "TB"
                },
                {
                "key": "archivedItems",
                "value": 1111,
                "unit": ""
                }
            ],
            "articles": [
                {
                "title": "Documentatie op zendesk"
                },
                {
                "title": "Handleiding voor invoerders"
                },
                {
                "title": "Si veteres ita miratur laudatque poetas"
                },
                {
                "title": "Ut nihil anteferat, nihil illis comperet, errat"
                },
                {
                "title": "Si quaedam nimis antique"
                }
            ]
        };
    }

    function getDataFromOverviewForService(service) {
        servicelist = getServicesList();
        for(var i = 0; i < servicelist.length; i++) {
            if(servicelist[i].service == service) return servicelist[i];
        }

    }


    new Vue({
        el: '#service-detail',
        data: {
            dataAPI: getDummyData(),
            dataHard: getDataFromOverviewForService(getDummyData().service)
        },



    });

});