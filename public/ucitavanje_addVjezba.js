window.onload = function() {
    var ajax = new XMLHttpRequest();
    var sGodinePostojeca = document.getElementsByName("sGodine")[0];
    var sGodineNova = document.getElementsByName("sGodine")[1];
    var sVjezbePostojeca = document.getElementsByName("sVjezbe")[0];
    var sVjezbePoveziZadatak = document.getElementsByName("sVjezbe")[1];
    
    ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && ajax.status == 200) { 
            var nizGodine = JSON.parse(JSON.parse(ajax.responseText).sGodine);
            var nizVjezbe = JSON.parse(JSON.parse(ajax.responseText).sVjezbe);

            for(var i=0; i<nizGodine.length; i++) {
                var option = document.createElement("option");
                var option2 = document.createElement("option");
                option.text = nizGodine[i].nazivGod;
                option.value = nizGodine[i].id;  
                option2.text = nizGodine[i].nazivGod;
                option2.value = nizGodine[i].id;                
                sGodinePostojeca.add(option);
                sGodineNova.add(option2);
            }

            for(var j=0; j<nizVjezbe.length; j++) {
                var option = document.createElement("option");
                var option2 = document.createElement("option");
                option.text = nizVjezbe[j].naziv;
                option.value = nizVjezbe[j].id;
                option2.text = nizVjezbe[j].naziv;
                option2.value = nizVjezbe[j].id;
                sVjezbePostojeca.add(option);
                sVjezbePoveziZadatak.add(option2);
            }
            // console.log("nesto");
            filter(); // ovdje se pozove filter da bi se odmah prilikom load-anja stranice u sZadatak pojavili potrebni id-evi
            

        }
        if(ajax.readyState == 4 && ajax.status == 404) {
            document.write = "Greska";
        }
    }

    ajax.open('GET', 'http://localhost:8080/dajPodatke', true);
    ajax.send();
}

function filter() {
    var sVjezbePoveziZadatak = document.getElementsByName("sVjezbe")[1];
    var sZadatakPoveziZadatak = document.getElementsByName("sZadatak")[0];

    // console.log(sVjezbePoveziZadatak.length);
    if(sVjezbePoveziZadatak.length == 0) return;

    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && ajax.status == 200) { 
            var nizZadaci = JSON.parse(ajax.responseText);
            if(nizZadaci.length == 0) {
                sZadatakPoveziZadatak.length = 0;
                return;
            }
            sZadatakPoveziZadatak.length = 0;
            for(var i=0; i<nizZadaci.length; i++) {
                var option = document.createElement("option");
                option.text = nizZadaci[i].naziv;
                option.value = nizZadaci[i].id;
                sZadatakPoveziZadatak.add(option);
            }
            
        }
        if(ajax.readyState == 4 && ajax.status == 404) {
            document.write = "Greska";
        }
    }
    
    var id = sVjezbePoveziZadatak.value;
    var url = 'http://localhost:8080/filter/' + id;

    ajax.open('GET', url, true);
    ajax.send();
    
}

function postRequest() {
    var idVjezbe = document.getElementsByName("sVjezbe")[1].value;
    var forma = document.getElementsByName("fPoveziZadatak")[0];
    forma.action = "http://localhost:8080/vjezba/" + idVjezbe + "/zadatak";
    forma.submit();
}
