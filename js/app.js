
/*
    Global functions
    Called from everywhere * . *
                           \___/
*/

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
            img_classname:"service-icon-ftp",
            alt:"FTP icon",
            available: isAvailable(),
            
        },
        {
            service:"AMS",
            title:"AMS &ndash; Registratie",
            description:"Registratieplatform voor analoge dragers.",
            link_info:"detail.html#ams",
            link_service:"http://registratie.viaa.be",
            img:"assets/avo.svg",
            img_classname:"service-icon-ams",
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
            img_classname:"service-icon-mam",
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
            img_classname:"service-icon-dbs",
            alt:"DBS icon",
            available:true,
        },
    ];
}

