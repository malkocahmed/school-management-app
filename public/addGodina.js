function funkcija1() {
    var divIspisa = document.getElementById("greska");
    var validacija = new Validacija(divIspisa); 
    var inputGodina = document.getElementsByName("naziv")[0];
    var inputRVjezbe = document.getElementsByName("rvjezbe")[0];
    var inputRSpirale = document.getElementsByName("rspirale")[0];
    validacija.godina(inputGodina); 
    validacija.naziv(inputRVjezbe);
    validacija.naziv(inputRSpirale);  
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
    var inputGodina = document.getElementsByName("naziv")[0];
    inputGodina.style.backgroundColor = "white";
}
function funkcija3() {
    var inputRVjezbe = document.getElementsByName("rvjezbe")[0];
    inputRVjezbe.style.backgroundColor = "white";

}
function funkcija4() {
    var inputRSpirale = document.getElementsByName("rspirale")[0];
    inputRSpirale.style.backgroundColor = "white";
}