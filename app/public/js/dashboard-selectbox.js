
function menuActions(e){
    var target = e.target,
    dropDown = target.dataset.toggle;
    if (dropDown){
        showMenu();
    } 
    e.preventDefault();
}

function showMenu() {
    var menu = document.getElementsByClassName("dropdown-menu")[0],
        final_h = 80;
    
    if (menu.style.height == final_h + "px") {
        showElement("dropdown-menu", 0, 1000);
        menu.style.display = "none";
        document.getElementsByClassName("menu")[0].style.borderRadius = "1rem";
    } else {
        showElement("dropdown-menu", final_h, 1000);
        menu.style.display = "block";
        document.getElementsByClassName("menu")[0].style.borderRadius = "0rem";
        document.getElementsByClassName("menu")[0].style.borderTopLeftRadius = "1rem";
        document.getElementsByClassName("menu")[0].style.borderTopRightRadius = "1rem";
         
    }
}

function showElement(elementID, final_h, interval){
    var el = document.getElementsByClassName(elementID)[0],
        curr_h = el.offsetHeight;

    if (el.timer) {
         clearTimeout(el.timer);
     }
   
    if (curr_h == final_h){
        return true;
    }
    
    if (curr_h < final_h) {
         var dist = Math.ceil((final_h - curr_h) / 10);
         curr_h = curr_h + dist;
     }

     if (curr_h > final_h) {
         var dist2 = Math.ceil((curr_h - final_h) / 10);
         curr_h = curr_h - dist2;
     }

     el.style.height = curr_h + "px";

     el.timer = setTimeout(function () {
         showElement(elementID, final_h, interval);
     });
}

var menu = document.getElementsByClassName("menu")[0];

 menu.addEventListener("click", menuActions, false);





 