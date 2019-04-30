var Validacija = (function(){
    //lokalne varijable


    var konstruktor = function(divElementPoruke) {

        divElementPoruke.innerHTML = "Sljedeća polja nisu validna: ";
        
        return {
            ime:function(inputElement) {
                var ime = inputElement.value;
                var provjera = true; 
                var regex = /^(([A-Z]{1}'?[A-Za-z]+[A-Za-z']*)(\s+|-+)){1,3}(([A-Z]{1}'?[A-Za-z]+[A-Za-z']*)(\s*|-*))?$/g; //regex koji dozvoljava 2 uzastpna apostrofa, ostalo radi
                if(!regex.test(ime)) provjera = false;
                
                
                //provjera za dva apostrofa
                if(provjera) {
                    for(var i=0; i<ime.length-1; i++) {
                        if(ime.charAt(i) === "'" && ime.charAt(i) === ime.charAt(i+1)) {
                            provjera = false;
                            break;
                        }
                    }
                }

                
                //pisemo u divove i mijenjamo boje
                if(!provjera) {
                    inputElement.style.backgroundColor = "orangered";
                    divElementPoruke.innerHTML += "ime,";
                }
                

            },
            godina:function(inputElement) {
                var godina = inputElement.value;
                var provjera = true;
                var regex = /^20\d\d\/20\d\d$/g;
                if(!regex.test(godina)) provjera = false;
                
    
                if(provjera) {
                    var prviJedinica, prviDesetica, drugiJedinica, drugiDesetica;
                    prviJedinica = Number(godina.charAt(3));
                    prviDesetica = Number(godina.charAt(2))*10;
                    drugiJedinica = Number(godina.charAt(8));
                    drugiDesetica = Number(godina.charAt(7))*10;
                    var razlika = (drugiDesetica+drugiJedinica)-(prviDesetica+prviJedinica);
                    
                    if(razlika != 1) provjera = false;
                }

                if(!provjera) {
                    inputElement.style.backgroundColor = "orangered";
                    divElementPoruke.innerHTML += "godina,";
                }


            },
            repozitorij:function(inputElement, regex) {
                var repozitorij = inputElement.value;
                if(!regex.test(repozitorij)) {
                    inputElement.style.backgroundColor = "orangered";
                    divElementPoruke.innerHTML += "repozitorij,";
                }

            },
            index:function(inputElement) {
                var indeks = inputElement.value;
                var provjera = true;
                var regex = /^[1-2]{1}\d{4}$/g;
                if(!regex.test(indeks)) provjera = false;

                var prvaCifra = Number(indeks.charAt(0));
                var drugaCifra = Number(indeks.charAt(1));
                if(provjera) {
                    if(prvaCifra*10+drugaCifra < 14 || prvaCifra*10+drugaCifra > 20) provjera = false;
                } 

                if(!provjera) {
                    inputElement.style.backgroundColor = "orangered";
                    divElementPoruke.innerHTML += "indeks,";
                }

            },
            naziv:function(inputElement) {
                var naziv = inputElement.value;
                var regex = /^[A-Za-z]+[A-Za-z0-9\\/\-"'!?:;,]+[0-9a-z]+$/g;
                if(!regex.test(naziv)) {
                    inputElement.style.backgroundColor = "orangered";
                    divElementPoruke.innerHTML += "naziv,";
                }

            },
            password:function(inputElement) {
                var password = inputElement.value;
                var provjera = true;
                var regex = /^[A-Za-z0-9]*$/g;
                if(!regex.test(password)) provjera = false;

                if(password.length < 8) provjera = false;

                if(provjera) {
                    var brojac = [0,0,0];
                    for(var i=0; i<password.length; i++) {
                        if(password.charAt(i) > 'A' && password.charAt(i) < 'Z') brojac[0]++;
                        if(password.charAt(i) > 'a' && password.charAt(i) < 'z') brojac[1]++;
                        if(password.charAt(i) > '0' && password.charAt(i) < '9') brojac[2]++;
                    }
    
                    var br = 0;
                    for(var j=0; j<3; j++) 
                        if(brojac[j] > 0) br++;
    
                    if(br < 2) provjera = false;
                }

                if(!provjera) {
                    inputElement.style.backgroundColor = "orangered";
                    divElementPoruke.innerHTML += "password,";
                }
            
            },
            url:function(inputElement) {
                var url = inputElement.value;
                var regex = /^(http|https|ftp|ssh):\/\/([a-z0-9]+[a-z0-9\-]*[a-z0-9]+\.)+([a-z0-9]+[a-z0-9\-]*[a-z0-9]+)(\/([a-z0-9]+[a-z0-9\-]*[a-z0-9]+\/)*([a-z0-9]+[a-z0-9\-]*[a-z0-9]+)(\?([a-z0-9]+[a-z0-9\-]*[a-z0-9]+)=([a-z0-9]+[a-z0-9\-]*[a-z0-9]+)&([a-z0-9]+[a-z0-9\-]*[a-z0-9]+)=([a-z0-9]+[a-z0-9\-]*[a-z0-9]+))?)?$/g;
                if(!regex.test(url)) {
                    inputElement.style.backgroundColor = "orangered";
                    divElementPoruke.innerHTML += "url,";
                }

            }
        }
    }

    return konstruktor;
}());