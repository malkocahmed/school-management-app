function test() {
    var ajax = new ZadaciAjax(function(tekst) { document.write(tekst.greska); });
    // ajax.dajJSON();
    // ajax.dajXML();
    ajax.dajCSV(); 
    
} 