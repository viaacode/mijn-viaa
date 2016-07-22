
/*
    Global functions
    Called from everywhere * . *
*/

// Our beautiful vanilla JS ajax call function <3
function ajaxcall(url, done) {
    var r = new XMLHttpRequest();

    r.onload = function () {
        if(r.readyState == 4 && r.status != 200) {
            return done('Er is een fout opgetreden (Code ' + r.status + ')');
        }
        if (r.readyState != 4 || r.status != 200) {
            return;
        }
        
        return done(null, JSON.parse(r.responseText));  
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

function logout() {
   ajaxcall('https://idp-qas.viaa.be/module.php/core/authenticate.php?as=viaa-ldap&logout', function(err, response) {
       if(err) {}
       else {
            window.location.replace('logout');
       }
   });
}



