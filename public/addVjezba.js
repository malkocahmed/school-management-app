function funkcija1() {
    var divIspisa = document.getElementById("greska");
    var validacija = new Validacija(divIspisa); 
    var inputNaziv = document.getElementById("naziv");
    validacija.naziv(inputNaziv);   
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
    var inputNaziv = document.getElementById("naziv");
    inputNaziv.style.backgroundColor = "white";
}