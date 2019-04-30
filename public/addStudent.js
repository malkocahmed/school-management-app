function funkcija1() {
    var divIspisa = document.getElementById("greska");
    var validacija = new Validacija(divIspisa); 
    var inputIme = document.getElementsByName("ime")[0];
    var inputIndeks = document.getElementsByName("index")[0];
    validacija.ime(inputIme);
    validacija.index(inputIndeks);
    if(divIspisa.innerHTML == "Sljedeća polja nisu validna: ")
        divIspisa.innerHTML = "";
    else {
        var str = divIspisa.innerHTML;
        str = str.substring(0,str.length-1);
        str+= "!";
        divIspisa.innerHTML = str;
    }
}
function funkcija2() {
    var inputIme = document.getElementsByName("ime")[0];
    inputIme.style.backgroundColor = "white";
}
function funkcija3() {
    var inputIndeks = document.getElementsByName("index")[0];
    inputIndeks.style.backgroundColor = "white";
}