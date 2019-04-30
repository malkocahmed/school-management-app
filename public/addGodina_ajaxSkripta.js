var godineAjax; 

window.onload = function() {
    var mojDiv = document.getElementById("glavniSadrzaj");
    godineAjax = new GodineAjax(mojDiv);
}
function osvjezi() {
    godineAjax.osvjezi();
}