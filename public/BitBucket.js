var BitBucket = (function() {

    var tokenPromise;
    // var tokenString;

    var konstruktor = function(key, secret) {
        // promise
        tokenPromise = new Promise(function(resolve, reject) {
            var ajax = new XMLHttpRequest();
            ajax.onreadystatechange = function() {
                if(ajax.readyState == 4 && ajax.status == 200) {
                    var token = JSON.parse(ajax.responseText).access_token;
                    // tokenString= token;
                    resolve(token);
                }
                if(ajax.readyState == 4) {
                    // alert("Provjerite ispravnost Vašeg key-a i secret-a!");
                    reject("Provjerite ispravnost Vašeg key-a i secret-a!");
                }
            }
    
            ajax.open("POST", "https://bitbucket.org/site/oauth2/access_token", true);
            ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            ajax.setRequestHeader("Authorization", "Basic " + btoa(key + ':' + secret));
            ajax.send("grant_type=" + encodeURIComponent("client_credentials"));
        });

        return {
            ucitaj:function(nazivRepSpi, nazivRepVje, callback) {
                tokenPromise.then(function(token) {
                    var ajax = new XMLHttpRequest();
                    // nazivRepSpi = "wt18"; 
                    ajax.onreadystatechange = function() {
                        if(ajax.readyState == 4 && ajax.status == 200) {
                            console.log(JSON.parse(ajax.responseText));
                            var odgovor = JSON.parse(ajax.responseText);
                            var imena = [];

                            var studenti = []; // u ovaj idu bez ponavljanja
                            var studentiPom = []; // svi koji se uzmu, bice ponavljanja
                            var indeksi = []; // pomocni niz kojim se vrsi provjera ponavljanja

                            for(var i=0; i<odgovor.values.length; i++) {
                                if(odgovor.values[i].name.startsWith(nazivRepSpi) || odgovor.values[i].name.startsWith(nazivRepVje))
                                    studentiPom.push({imePrezime: odgovor.values[i].owner.username, index: (odgovor.values[i].name).substr(-5, 5)});
                            }
                            // biranje nedodanih iz studentiPom i prebacivanje u studenti
                            for(var j=0; j<studentiPom.length; j++) {
                                if(!indeksi.includes(studentiPom[j].index)) {
                                    indeksi.push(studentiPom[j].index);
                                    studenti.push(studentiPom[j]);
                                }
                            }
                            callback(null, studenti);

                        }
                        if(ajax.readyState == 4) {
                            callback(ajax.status, null);
                            // console.log("Greska");
                        }
                    }
    
                    // query koji provjerava da li ime repozitorija sadrzi dobijene parametre
                    var url = 'https://api.bitbucket.org/2.0/repositories?role=member&q=(name+%7E+%22' + nazivRepSpi + '%22+OR+name+%7E+%22' + nazivRepVje + '+%25%22)'; 
                    
                    ajax.open("GET", url, true); 
                    ajax.setRequestHeader("Authorization", "Bearer " + token);
                    ajax.send();
                }).catch(function(poruka) {
                    callback(0, null);
                    alert(poruka);
                });
            }
        }
    }
    return konstruktor;
}());