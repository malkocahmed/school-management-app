var mojDiv=document.getElementById("commiti");
// var tabela = new CommitTabela(mojDiv,5);
var tabela;
function kreiranjeTabele() {
    var input = document.getElementById("brojZadataka");
    mojDiv.innerHTML = "";
    tabela = new CommitTabela(mojDiv,input.value);
}

function dodavanjeCommita() {
    var inputrbzadatka = document.getElementById("rbZadatka");
    var inputUrl = document.getElementById("url");

    tabela.dodajCommit(Number(inputrbzadatka.value), inputUrl.value);
}
function brisanjeCommita() {
    var inputrbzadatka = document.getElementById("rbZadatkaBrisanje");
    var inputrbCommita = document.getElementById("rbCommitaBrisanje");

    tabela.obrisiCommit(Number(inputrbzadatka.value), Number(inputrbCommita.value)); 
    // tabela.obrisiCommit(0,0); 
}
function editovanjeCommita() {
    var inputrbzadatka = document.getElementById("rbZadatkaEdit");
    var inputrbCommita = document.getElementById("rbCommitaEdit");
    var inputUrl = document.getElementById("urlEdit");

    tabela.editujCommit(Number(inputrbzadatka.value), Number(inputrbCommita.value), inputUrl.value);

}