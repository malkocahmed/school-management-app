function funkcija1() {
    var divIspisa = document.getElementById("greska");
    var validacija = new Validacija(divIspisa); 
    var inputPassword = document.getElementsByName("password")[0];
    validacija.password(inputPassword); 
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
    var inputPassword = document.getElementsByName("password")[0];
    inputPassword.style.backgroundColor = "white";
}