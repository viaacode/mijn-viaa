
$(document).ready(function() {

    // Is it ok that these functions are global?
    function isAvailable() {
        return (2 == 2);
    }

    function getlistitems() {    
        return  [
            {
                title:"FTP &ndash; Bestanden",
                description:"Korte info Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum viverra malesuada. Sed auctor accumsan tempus. Nulla ac augue a odio porttitor porta. Phasellus venenatis ornare dolor, sed luctus justo mattis et. Donec tincidunt lacus eget, ipsum placerat pharetra. Nulla eget varius metus.",
                link_info:"detailAms.html",
                link_service:"ftp://ftp.viaa.be/",
                img:"assets/ftp.svg",
                img_classname:"service-icon-ftp",
                alt:"FTP icon",
                available: isAvailable(),
                
            },
            {
                title:"AMS &ndash; Registratie",
                description:"Korte info Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum viverra malesuada. Sed auctor accumsan tempus. Nulla ac augue a odio porttitor porta. Phasellus venenatis ornare dolor, sed luctus justo mattis et. Donec tincidunt lacus eget, ipsum placerat pharetra. Nulla eget varius metus.",
                link_info:"detailAms.html",
                link_service:"http://registratie.viaa.be",
                img:"assets/avo.svg",
                img_classname:"service-icon-ams",
                alt:"AMS icon",
                available:false,
            },
            {
                
                title:"MAM &ndash; Archief",
                description:"Korte info Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum viverra malesuada. Sed auctor accumsan tempus. Nulla ac augue a odio porttitor porta. Phasellus venenatis ornare dolor, sed luctus justo mattis et. Donec tincidunt lacus eget, ipsum placerat pharetra. Nulla eget varius metus.",
                link_info:"detailMam.html",
                link_service:"https://archief.viaa.be/",
                img:"assets/mam.svg",
                img_classname:"service-icon-mam",
                alt:"MAM icon",
                available: true,
            },
            {
                
                title:"DBS &ndash; Contracten",
                description:"Korte info Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum viverra malesuada. Sed auctor accumsan tempus. Nulla ac augue a odio porttitor porta. Phasellus venenatis ornare dolor, sed luctus justo mattis et. Donec tincidunt lacus eget, ipsum placerat pharetra. Nulla eget varius metus.",
                link_info:"detailDbs.html",
                link_service:"https://oauth.viaa.be/user/login.jsp",
                img:"assets/avo.svg",
                img_classname:"service-icon-dbs",
                alt:"DBS icon",
            },
        ];
    }



    new Vue({
        el: '#services-app',
        data: {
            listitems: getlistitems()
        }
    });

});

