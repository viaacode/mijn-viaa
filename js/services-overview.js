
(function() {
    new Vue({
        el: '#services-app',
        data: {
            serviceslist: getServicesList(),
        },
        methods: {
            reload: function() {
                window.location.reload();
            }
        },
    });
})();

