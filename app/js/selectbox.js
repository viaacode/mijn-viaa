
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
        final_h = 100;
    
    if (menu.style.height == final_h + "px") {
        showElement("dropdown-menu", 0, 10);
        menu.style.display = "none";
    } else {
        showElement("dropdown-menu", final_h, 10);
        menu.style.display = "block";
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
         var dist = Math.ceil((curr_h - final_h) / 10);
         curr_h = curr_h - dist;
     }

     el.style.height = curr_h + "px";

     el.timer = setTimeout(function () {
         showElement(elementID, final_h, interval);
     });
}

var menu = document.getElementsByClassName("menu")[0];

 menu.addEventListener("click", menuActions, false);





 