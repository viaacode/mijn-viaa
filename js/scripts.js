
$(document).ready(function() {
    new Vue({
        el: '#service-list',
        components: {
            'service-listitem': {

                template: '#service-listitem-template',
                props: ['title', 'description', 'link_info', 'link_service', 'icon_classname', 'img']
            }  
        },
        data: {
            message: 'Vue.js is working'
        }
    });

});

