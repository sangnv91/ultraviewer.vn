			/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    //document.getElementById("myDropdown").classList.toggle("show");
	toggleClass(document.getElementById("myDropdown"), 'show');
}

function hasClass(ele, cls) {
    return ele.getAttribute('class').indexOf(cls) > -1;
}
function removeClass(ele, cls) {
    if (ele.classList) {
        ele.classList.remove(cls);
    } else if (hasClass(ele, cls)) {
        ele.setAttribute('class', ele.getAttribute('class').replace(cls, ' ').replace('  ' , ' '));
    }
}
function addClass(ele, cls) {
    if (ele.classList) {
        ele.classList.add(cls);
    } else if (!hasClass(ele, cls)) {
        ele.setAttribute('class', ele.getAttribute('class') + ' ' + cls);
    }
}
function toggleClass(ele, cls) {
if (hasClass(ele, cls)) {
removeClass(ele, cls);
} else {
addClass(ele, cls);
}
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!$(event.target).hasClass('dropbtn')) { // if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
	if (hasClass(openDropdown)) { 
     // if (openDropdown.classList.contains('show')) {
        //openDropdown.classList.remove('show'); not supported in IE9
		removeClass(openDropdown, 'show');
      }
    }
  }
} 