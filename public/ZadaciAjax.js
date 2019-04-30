/* Metode dajXML, dajCSV i dajJSON prave GET zahtjev koristeći XMLHttpRequest na url iz prethodnog
zadatka. Kada se dobije odgovor sa servera pozovite callbackFn i kao parametar proslijedite tijelo odgovora
sa servera. Ukoliko se pozove više metoda,, a odgovor nije stigao pozovite callbackFn sa parametrom
{greska:”Već ste uputili zahtjev”}. Ako odgovor za neku od metoda ne stigne u roku od 2 sekunde prekinite
taj zahtjev */

var ZadaciAjax = (function() {
    var konstruktor = function(callbackFn) {
        var ajax = new XMLHttpRequest();
        var zauzet = false;
        ajax.onreadystatechange = function() {
            if(ajax.readyState == 4 && ajax.status == 200) { 
                document.getElementById("sadrzaj").innerHTML = ajax.responseText;
                zauzet = false;
            }
            if(ajax.readyState == 4 && ajax.status == 403) {
                document.write('Traje duze od 2 sekunde');
                zauzet = false;
            }
            if(ajax.readyState == 4 && ajax.status == 404) {
                document.write("Greska!");
                zauzet = false;
            }
        }

        ajax.ontimeout = function() {
            ajax.abort();
            zauzet = false;
            console.log('Traje duze od 2 sekunde!'); // ovo se ispisuje u console u browseru
        }
        
        return {
            // ajax.timeout = 2000 milisekundi = 2 sekunde
            // pozivanje vise metoda -> rijeseno bool varijablom zauzet
            dajXML:function() {
                if(!zauzet) {
                    ajax.open('GET', 'http://localhost:8080/zadaci', true);
                    ajax.setRequestHeader("Accept", "application/xml");
                    ajax.timeout = 2000;
                    zauzet = true;
                    ajax.send();
                }
                else callbackFn({"greska" : 'Već ste uputili zahtjev'});
            },
            dajCSV:function() {
                if(!zauzet) {
                    ajax.open('GET', 'http://localhost:8080/zadaci', true);
                    ajax.setRequestHeader("Accept", "text/csv");
                    ajax.timeout = 2000;
                    zauzet = true;
                    ajax.send();
                }
                else callbackFn({"greska" : 'Već ste uputili zahtjev'});
            },
            dajJSON:function() {
                if(!zauzet) {
                    ajax.open('GET', 'http://localhost:8080/zadaci', true);
                    ajax.setRequestHeader("Accept", "application/json");
                    ajax.timeout = 2000;
                    zauzet = true;
                    ajax.send();
                }
                else callbackFn({"greska" : 'Već ste uputili zahtjev'});
            }
        }
    }
    return konstruktor;
}());
