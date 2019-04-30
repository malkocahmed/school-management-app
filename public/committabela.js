var CommitTabela = (function() {

    var  tabela, tabelaBody;
    var brojaci = [];

    var konstruktor = function(divElement, brojZadataka) {
        
        tabela = document.createElement("table");
        tabelaBody = document.createElement("tbody");
        for(var br=0; br<brojZadataka;br++) {
            brojaci[br]=1;
        }

        for(var i=0; i<=brojZadataka; i++) {
            var row = document.createElement("tr");
            var cell;
            var cellTekst;
            for(var j=0; j<2; j++) {
                if(i == 0 && j == 0) {
                    cell = document.createElement("th");
                    cellTekst = document.createTextNode("Naziv zadatka");
                }
                else if(i == 0 && j == 1) {
                    cell = document.createElement("th");
                    cellTekst = document.createTextNode("Commiti");
                }
                else if(j == 0) {
                    cell = document.createElement("td");
                    cellTekst = document.createTextNode("Zadatak " + i);
                }
                else{  
                    cell = document.createElement("td");
                    cellTekst = document.createTextNode("");
                }

                // cell.colSpan = 1;
                cell.appendChild(cellTekst);
                row.appendChild(cell);
            }
            tabelaBody.appendChild(row);
        }
        tabela.appendChild(tabelaBody);
        divElement.appendChild(tabela); 
        

        return {
            dodajCommit:function(rbZadatka, url) {
                if(rbZadatka+1 > brojZadataka || rbZadatka < 0) return -1;
                var broj = tabela.rows[rbZadatka+1].cells.length-1;
                if(tabela.rows[rbZadatka+1].cells[broj].textContent == "") {
                    var celija = tabela.rows[rbZadatka+1].insertCell(broj);
                    celija.innerHTML = '<a href="' + url + '">' + brojaci[rbZadatka]++ + '</a>';
                    var zadnja = tabela.rows[rbZadatka+1].cells[broj+1];
                    if(zadnja.colSpan == 1) {
                        tabela.rows[rbZadatka+1].deleteCell(-1);
                    } 
                     else {
                        zadnja.colSpan--;
                    }  
    
                }
                else {
                    broj++;
                    // var celija = tabela.rows[rbZadatka+1].insertCell(broj);
                    var celija = tabela.rows[rbZadatka+1].insertCell(-1);
                    celija.innerHTML = '<a href="' + url + '">' + brojaci[rbZadatka]++ + '</a>';
                    for(var i=0; i<=brojZadataka; i++) {
                        if(i != rbZadatka+1) {
                            var zadnja = tabela.rows[i].cells[tabela.rows[i].cells.length-1];
                            if(i == 0) {
                                zadnja.colSpan = broj;
                            }
                            else if(zadnja.textContent == "") {
                                zadnja.colSpan = broj+2 - tabela.rows[i].cells.length;
                            } 
                            else {
                                var celija = tabela.rows[i].insertCell(-1);
                                celija.innerHTML =  "";
                            }

                        }
                    }
                } 

            },
            editujCommit:function(rbZadatka, rbCommita, url) {
                //provjera da li su parametri ispravni
                if(rbZadatka+1 > brojZadataka || rbZadatka < 0) return -1;
                var broj = tabela.rows[rbZadatka+1].cells.length-1;
                if(rbCommita >= broj || rbCommita < 0) return -1;
                if(tabela.rows[rbZadatka+1].cells[rbCommita+1].textContent == "") return -1; 

                for(var i=1; i<=brojZadataka; i++) {
                    if(i == rbZadatka+1) {
                        var broj = tabela.rows[i].cells[rbCommita+1].textContent;
                        tabela.rows[i].cells[rbCommita+1].innerHTML = '<a href="' + url + '">' + broj + '</a>';
                    }
                }

            },
            obrisiCommit:function(rbZadatka, rbCommita) {
                //provjera da li su parametri ispravni
                if(rbZadatka+1 > brojZadataka || rbZadatka < 0) return -1;
                var broj = tabela.rows[rbZadatka+1].cells.length-1;
                if(rbCommita >= broj || rbCommita < 0) return -1;
                if(tabela.rows[rbZadatka+1].cells[rbCommita+1].innerHTML == "") return -1; 
            
                // document.write("ahmed");
                //brojanje reda s najvise celija racunajuci samo celije koje imaju content
                var brojMax = 0;
                var index = 0;
                for(var i=1; i<=brojZadataka; i++) {
                    var last = tabela.rows[i].cells[tabela.rows[i].cells.length-1];
                    if(last.textContent != "") {
                        brojMax = tabela.rows[i].cells.length-1;
                        index = i;
                        break; 
                    }
                }
                
                //brojac koliko ima redova s najvise celija
                var brojacMaxRedova = 0;
                for(var j=1; j<=brojZadataka; j++) {
                    var last = tabela.rows[j].cells[tabela.rows[j].cells.length-1];
                    if(tabela.rows[j].cells.length-1 == brojMax && last.textContent != "")
                        brojacMaxRedova++;
                }

                // document.write(brojMax); 
                // document.write(brojacMaxRedova); 
               
                for(var k=0; k<=brojZadataka; k++) {
                    if(k == 0) {
                        var zadnja = tabela.rows[0].cells[1];
                        if(brojacMaxRedova == 1 && index == rbZadatka+1) { 
                            zadnja.colSpan--;
                        }
                        else {
                            zadnja.colSpan = brojMax;
                        }
                    } 
                    else if(k == rbZadatka+1) {
                        if(tabela.rows[k].cells.length-1 == brojMax && tabela.rows[k].cells[tabela.rows[k].cells.length-1].textContent != "") {
                            if(brojacMaxRedova > 1) {
                                var nova = tabela.rows[k].insertCell(-1);
                                nova.innerHTML = "";
                                nova.colSpan = 1;
    
                                tabela.rows[k].deleteCell(rbCommita+1);
                            }
                            else {
                                if(brojMax == 1) {
                                    tabela.rows[k].cells[rbCommita+1] .textContent = "";
                                }
                                else {
                                    tabela.rows[k].deleteCell(rbCommita+1);
                                    for(var l=1; l<=brojZadataka; l++) {
                                        if(l != k) {
                                            var zadnjaPom = tabela.rows[l].cells[tabela.rows[l].cells.length-1];
                                            if(tabela.rows[l].cells.length-1 != brojMax) {
                                                zadnjaPom.colSpan--;
                                            }
                                            else {
                                                tabela.rows[l].deleteCell(tabela.rows[l].cells.length-1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            var last = tabela.rows[k].cells[tabela.rows[k].cells.length-1];
                            tabela.rows[k].deleteCell(rbCommita+1);
                            last.colSpan++;
                            
                        }    
                    }
                    else {
                        continue;
                    } 
                
                } 
            } 
        }
    }

    return konstruktor;

}());

