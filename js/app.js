
/*
    Global functions
    Called from everywhere * . *
*/

// Our beautiful vanilla JS ajax call function <3
function ajaxcall(url, done) {
    var r = new XMLHttpRequest();
    r.open("GET", url, true);
    r.onreadystatechange = function () {
        // We have to know possible error statuses here to show relevant error messages
        if(r.status == 400 || r.status == 404 || r.status == 500) {
            return done(r.responseText);
        }
        if (r.readyState != 4 || r.status != 200) {
            return;
        }
        done(null, JSON.parse(r.responseText));  
    };
    r.send();
}

// Make API call to check if the user that is logged in has access to this service
function isAvailable() {
    return (2 == 2);
}

// Overview of hard coded data about services - all references point to these objects
// Unique identifier is the 'service' key
function getServicesList() {
    return [
        {
            service:"FTP",
            title:"FTP &ndash; Bestanden",
            description:"Uploaden of downloaden van uw bestanden.",
            link_info:"detail.html#ftp",
            link_service:"ftp://ftp.viaa.be/",
            img:"assets/ftp.svg",
            alt:"FTP icon",
            available: isAvailable(),
            
        },
        {
            service:"AMS",
            title:"AMS &ndash; Registratie",
            description:"Registratieplatform voor analoge dragers.",
            link_info:"detail.html#ams",
            link_service:"http://registratie.viaa.be",
            img:"assets/ams.svg",
            img_alt:"AMS icon",
            available:false,
        },
        {
            service:"MAM",
            title:"MAM &ndash; Archief",
            description:"Centrale storage voor alle metadata van het VIAA (MediaHaven).",
            link_info:"detail.html#mam",
            link_service:"https://archief.viaa.be/",
            img:"assets/mam.svg",
            alt:"MAM icon",
            available: true,
        },
        {
            service:"DBS",
            title:"DBS &ndash; Contracten",
            description:"Bewaren van online documenten zoals Contracten en Service Agreements.",
            link_info:"detail.html#dbs",
            link_service:"https://oauth.viaa.be/user/login.jsp",
            img:"assets/avo.svg",
            alt:"DBS icon",
            available:true,
        }
    ];
}

