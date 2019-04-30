var listaStudenata; 
var bitbucket;
var key = "";
var secret = "";
// ovaj onload je potreban kako bi se u sGodina ispisali id-evi godina iz baze kada se ucita stranica
window.onload = function() {
    var sGodina = document.getElementsByName("sGodina")[0];
    var inputKey = document.getElementsByName("key")[0];
    var inputSecret = document.getElementsByName("secret")[0];
    /* inputKey.value = "yYVsQJAGWUA28q4HTR";
    inputSecret.value = "qNgGTYpUDZsReEK85Vjdf5mDUDrz7AuY"; */
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && ajax.status == 200) { 
            var niz = JSON.parse(ajax.responseText);
            for(var i=0; i<niz.length; i++) {
                var option = document.createElement("option");
                option.text = niz[i].nazivGod;
                option.value = niz[i].id;              
                sGodina.add(option);
            }
        }
        if(ajax.readyState == 4) {
            document.write = "Greska";
        }
    }

    ajax.open("GET", "http://localhost:8080/godine", true);
    ajax.send();
}

// funkcija koju kreiramo da bi je slali kao parametar prilikom poziva BitBucket.ucitaj
function ispisiUConsole(greska, studenti) {
    if(greska == null) {
        listaStudenata = studenti;
        console.log("Dobijena lista studenata:\n" + JSON.stringify(studenti));
    }
    else {
        key = "";
        secret = "";
    }
}

function kreiranjeinstance() {
    var inputKey = document.getElementsByName("key")[0];
    var inputSecret = document.getElementsByName("secret")[0];

    if(document.getElementsByName("sGodina")[0].length == 0) return;
    if(inputKey.value == "" || inputSecret.value == "") { alert("Unesite key i secret!"); return; }

    var repspi, repvje;
    if(inputKey.value != key || inputSecret.value != secret) {
        var promise = new Promise(function(resolve, reject) {
            var ajax = new XMLHttpRequest();
            ajax.onreadystatechange = function() {
                if(ajax.readyState == 4 && ajax.status == 200) { 
                    var json = JSON.parse(ajax.responseText);
                    repspi = json.nazivRepSpi;
                    repvje = json.nazivRepVje;
                    if(repspi == "" || repvje == "") {
                        alert("NazivRepSpi i NazivRepVje ne mogu biti prazni stringovi!");
                        return;
                    }
                    bitbucket = new BitBucket(inputKey.value, inputSecret.value);
                    key = inputKey.value;
                    secret = inputSecret.value;
                    resolve(bitbucket);
                }
                if(ajax.readyState == 4 && ajax.status == 404) {
                    document.write = "Greska";
                }
            }
            var id = document.getElementsByName("sGodina")[0].value;
            var url = "http://localhost:8080/bitbucket/" + id;
            ajax.open("GET", url, true);
            ajax.send();
        });
        promise.then(function(bitbucket) {
            // console.log(repspi + ' ' + repvje);
            bitbucket.ucitaj(repvje, repspi, ispisiUConsole);
        }).then(function() {
            document.querySelector("input[type='button']").disabled = false;
        });
    }
    else {
        alert("Instanca modula BitBucket je već kreirana s ovim key-om i secret-om!");
    }
}

function postzahtjev() {
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && ajax.status == 200) { 
            var odgovor = JSON.parse(ajax.responseText).message;
            alert(odgovor);
        }
        if(ajax.readyState == 4 && ajax.status == 404) {
            alert("Greška!");
        }
    }
    var sGodina = document.getElementsByName("sGodina")[0];
    var id = sGodina.value;
    // console.log("Godina: " + id);
    
    var json = JSON.stringify({godina: id, studenti : listaStudenata});
    // console.log("ahmed \n" + JSON.stringify(listaStudenata));
    // console.log(json);

    ajax.open('POST', 'http://localhost:8080/student', true);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.send(json);
}
