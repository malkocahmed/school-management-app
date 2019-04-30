var GodineAjax = (function() {

    /* var ajax = new XMLHttpRequest();
    var godineJSON = []; */
    var konstruktor = function(divSadrzaj) {
        var ajax = new XMLHttpRequest();
        var godineJSON = [];
        ajax.onreadystatechange = function() {
            if(ajax.readyState == 4 && ajax.status == 200) { 
                godineJSON = JSON.parse(ajax.responseText);
                // document.write(godineJSON.length);
                // var html = "<div> <button type=\'button\' onclick=\'osvjezi()\'>Osvježi</button> </div>";
                var html = "";
                for(var i=0; i<godineJSON.length; i++) {
                    html += "<div class =\'item\'> <h2>" + godineJSON[i].nazivGod + "</h2>" +
                    "<p>Naziv repozitorija vježbi: " + godineJSON[i].nazivRepVje + "</p>" +
                    "<p>Naziv repozitorija spirale: " + godineJSON[i].nazivRepSpi + "</p>" +
                    "</div>";
                }
                divSadrzaj.innerHTML = html;
            }
            if(ajax.readyState == 4 && ajax.status == 404) {
                divSadrzaj.innerHTML = "Greska";
            }
        }
        ajax.open('GET', 'http://localhost:8080/godine', true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send();
        return {
            osvjezi:function() {
                // ajax = new XMLHttpRequest();
                ajax.open('GET', 'http://localhost:8080/godine', true);
                ajax.setRequestHeader("Content-Type", "application/json");
                ajax.send();
            }
        }
    }
    return konstruktor;
}());