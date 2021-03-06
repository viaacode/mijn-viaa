// Overview of hard coded data about services - all references point to these objects
// Unique identifier is the 'service' key
function getServicesList() {
    return [
        {
            service:"AMS",
            title:"AMS &ndash; Registratie",
            description:"Registratieplatform voor analoge dragers.",
            link_info:"detail#ams",
            link_service:"http://registratie.viaa.be",
            img:"/public/assets/ams.svg",
            img_alt:"AMS icon",
            available: mijnVIAA.isServiceAvailable("AMS"),
        },
        {
            service:"ZEN",
            title:"VIAA support",
            description:"Handleidingen om u te helpen met VIAA services. Hier kunt u ook VIAA contacteren met vragen of problemen.",
            link_info:"detail#zen",
            link_service:"https://viaa.zendesk.com/hc/nl",
            img:"/public/assets/zendesk.svg",
            alt:"ZEN icon",
            available: true,
        },
        {
            service:"MAM",
            title:"MAM &ndash; Archief",
            description:"Platform om audiovisueel materiaal te beheren.",
            link_info:"detail#mam",
            link_service:"https://archief.viaa.be/",
            img:"/public/assets/mam.svg",
            alt:"MAM icon",
            available: mijnVIAA.isServiceAvailable("MAM"),
        },
        {
            service:"DBS",
            title:"DBS &ndash; Contracten",
            description:"Beheren van online documenten zoals contracten en Service Agreements.",
            link_info:"detail#dbs",
            link_service:"https://contract.viaa.be/",
            img:"/public/assets/avo.svg",
            alt:"DBS icon",
            available: mijnVIAA.isServiceAvailable("DBS"),
        },
        {
            service:"FTP",
            title:"FTP &ndash; Bestanden",
            description:"Downloaden van bestanden die geëxporteerd zijn.",
            link_info:"detail#ftp",
            link_service:"ftp://ftp.viaa.be",
            img:"/public/assets/ftp.svg",
            alt:"FTP icon",
            available: mijnVIAA.isServiceAvailable("FTP"),
            
        }
    ];
}
