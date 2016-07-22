
/*
    Global functions
    Called from everywhere * . *
*/

// Our beautiful vanilla JS ajax call function <3
function ajaxcall(url, done) {
    var r = new XMLHttpRequest();

    r.onload = function () {
        if (r.readyState != 4) {
            return;
        }

        if(r.status == 401) {
            window.location.replace('/');
        }

        var jsendResponse = JSON.parse(r.responseText);
        console.log(jsendResponse);

        if (jsendResponse.status != 'success') {
            return done('Er is een fout opgetreden: ' + jsendResponse.message);
        }

        if(r.status != 200) {
            return done('Er is een fout opgetreden (Code ' + r.status + ')');
        }

        return done(null, jsendResponse.data);
    };
    r.onerror = function() {
        return done('Er is een fout opgetreden (Server niet bereikbaar, Code ' + r.status + ')');
    };

    r.open("GET", url, true);
    // Needs to be allowed on server
    //r.setRequestHeader('max-age', '3600');
    r.send();
    return r; // Return it so we can cancel it * . *
}



