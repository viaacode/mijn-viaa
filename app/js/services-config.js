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
            img:"/public/assets/ftp.svg",
            alt:"FTP icon",
            available: isServiceAvailable("FTP"),
            
        },
        {
            service:"AMS",
            title:"AMS &ndash; Registratie",
            description:"Registratieplatform voor analoge dragers.",
            link_info:"detail.html#ams",
            link_service:"http://registratie.viaa.be",
            img:"/public/assets/ams.svg",
            img_alt:"AMS icon",
            available: isServiceAvailable("AMS"),
        },
        {
            service:"MAM",
            title:"MAM &ndash; Archief",
            description:"Centrale storage voor alle metadata van het VIAA (MediaHaven).",
            link_info:"detail.html#mam",
            link_service:"https://archief.viaa.be/",
            img:"/public/assets/mam.svg",
            alt:"MAM icon",
            available: isServiceAvailable("MAM"),
        },
        {
            service:"DBS",
            title:"DBS &ndash; Contracten",
            description:"Bewaren van online documenten zoals Contracten en Service Agreements.",
            link_info:"detail.html#dbs",
            link_service:"https://oauth.viaa.be/user/login.jsp",
            img:"/public/assets/avo.svg",
            alt:"DBS icon",
            available: isServiceAvailable("DBS"),
        }
    ];
}