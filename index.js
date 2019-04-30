const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const bodyParser = require('body-parser');
const async = require('async');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "pug");

// za spiralu 4 dodajemo:
const Sequelize = require('sequelize');
const db = require('./db.js');

db.sequelize.sync().then(function() {
    console.log('Kreiranje tabela i veza zavrseno!');
});

// 1. ZADATAK SPIRALA 4 - OBUHVATA SVE SA SPIRALE 3 ALI DA RADI S BAZOM TJ. SEQUELIZE
// 1. zadatak:
app.use(express.static('public'));

// 2. zadatak:*
// definisemo storage engine kako je zadato postavkom
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './zadaci');
    },
    filename: function(req, file, cb) {
        cb(null, req.body['naziv'] + '.pdf');
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        provjeriImeITipFajla(req, file, callback);
    }
}).single('postavka');

// pomocna funkcija koja provjerava da li je fajl pdf i ime fajla da li postoji
function provjeriImeITipFajla(req, file, callback) {
    // dozvoljeni tip fajla je po postavci samo pdf
    var tipovi = /pdf/; // po potrebi u regularnom izrazu mogu biti dodani i drugi

    // provjera ekstenzije
    var ekstenzija = tipovi.test(path.extname(file.originalname).toLowerCase());

    // provjera mimetype-a
    var mime = tipovi.test(file.mimetype);

    // console.log('ahmed');
    var postoji = false; // pretpostavimo da ne postoji fajl s istim imenom u /zadaci folderu
    var imenaZadataka = [];
    var imeZadatka = req.body['naziv'] + '.pdf';
    
    db.zadatak.findOne({ where: {naziv: req.body['naziv'] } }).then(zadatak => {
        if(zadatak != null) postoji = true;

        if(ekstenzija && mime && !postoji) {
            return callback(null, true);
        }
        else {
            callback('Greska');
        }
    });
}

// post request na /addZadatak
app.post('/addZadatak', function(req, res) {
    upload(req, res, function(err) {
        if(err) {
            res.render("greska", {greska:{poruka:"Greška: Fajl sa tim nazivom postoji ili tip fajla nije pdf!"}}); //ako nije proslo vraca pug
        }
        else {
            var linkZaDownload = 'http://localhost:8080/download/' + encodeURIComponent(req.body['naziv'] + '.pdf');
            
            var json = JSON.stringify({naziv : req.body['naziv'], postavka : linkZaDownload}); // pravimo json
            var imeJsona = req.body['naziv'] + 'Zad.json'; // dajemo ime jsonu
            db.zadatak.create({naziv: req.body['naziv'], postavka: linkZaDownload}).then(function(zadatak) {
                fs.writeFile('./json/' + imeJsona, json, 'utf8', function() { // pisanje json u folder json
                    // res.render("greska", {greska:{poruka:"Uspješno su dodani .pdf, .json fajl i ubačeni su podaci u bazu podataka!"}});
                    res.contentType("application/json");
                    res.send(json);
                }); 
            });
        }
    });
});

// get koji vraca pdfove u skladu s linkom za download
app.get('/download/:ime', function(req, res) {
    if(req.params.ime.length < 5) {
        res.render('greska', {greska:{poruka:"Greška: PDF fajl s tim imenom ne postoji!"}});
        return;
    }

    var imeZadatka = (req.params.ime).substr(0,req.params.ime.length-4);
    // citanje imena zadataka iz foldera zadaci u kojem su pdfovi
    db.zadatak.findOne({where: {naziv: imeZadatka}}).then(function(zadatak) {
        if(zadatak != null) {
            res.sendFile('/zadaci/' + imeZadatka + '.pdf', {root : __dirname});
        }
        else res.render('greska', {greska:{poruka:"Greška: PDF fajl s tim imenom ne postoji!"}});
    });
});

// 3. zadatak:
app.get('/zadatak', function(req, res) {
    var u = url.parse(req.url,true).query; // uzimanje parametra naziv iz urla
    var imeFajla = u.naziv + '.pdf'; 

    db.zadatak.findOne({ where: { naziv: u.naziv }}).then(function(zadatak) {
        if(zadatak == null) {
            res.render('greska', {greska:{poruka:"Greška: Zadatak s tim imenom ne postoji!"}});
        }
        else {
            res.sendFile('/zadaci/' + imeFajla, {root : __dirname});
        }
    });
});

// 4. zadatak:
app.post('/addGodina', function(req, res) {
    let tijelo = req.body;
    
    db.godina.findOne({ where: { nazivGod: tijelo['nazivGod']}}).then(function(godina) {
        if(godina != null) {
            res.render("greska", {greska:{poruka:"Greška: Godina sa unesenim imenom vec postoji!"}}); // ako postoji vrati pug s odg. greskom
        }
        else {
            db.godina.create({ nazivGod: tijelo['nazivGod'], nazivRepVje: tijelo['nazivRepVje'], nazivRepSpi: tijelo['nazivRepSpi']}).then(function(godina) {
                // res.sendFile('/public/addGodina.html', {root: __dirname});
                res.redirect("http://localhost:8080/addGodina.html");
            });

        }
    });
    
});

// 5. zadatak:
app.get('/godine', function(req, res) {
    db.godina.findAll({attributes: ['id', 'nazivGod', 'nazivRepVje', 'nazivRepSpi']}).then(function(godine) {
        res.writeHead(200, {'Content-Type' : 'application/json'}); 
        res.end(JSON.stringify(godine));
    });
});


// 7. zadatak:
app.get('/zadaci', function(req, res) {
    db.zadatak.findAll({attributes: ['naziv', 'postavka']}).then(function(zadaci) {

        if(req.accepts("json")) {
            res.contentType("application/json");
            res.end(JSON.stringify(zadaci));
            return;
        }
        else if(req.accepts("xml")) {
            var xml = '<?xml version=\"1.0\" encoding=\"UTF-8\"?>' + '\n' + '<zadaci>'+ '\n';    
            for(var j=0;j<zadaci.length; j++) {
                xml += '    <zadatak>' + '\n';
                xml += '        <naziv>' + zadaci[j].naziv + '</naziv>' + '\n';
                xml += '        <postavka>' + zadaci[j].postavka + '</postavka>' + '\n';
                xml += '    </zadatak>' + '\n';
            }
            xml += '</zadaci>';
            res.contentType("application/xml");
            res.end(xml);
            return;
        }
        else if(req.accepts("csv")) {
            var csv = '';
            for(var i=0; i<zadaci.length; i++) {
                if(i == zadaci.length-1) {
                    csv += zadaci[i].naziv + ',' + zadaci[i].postavka;
                    break;
                }
                csv += zadaci[i].naziv + ',' + zadaci[i].postavka + '\n';
            }
            res.contentType("text/csv");
            res.end(csv);
            return;
        }
        else {
            res.contentType("application/json");
            res.end(JSON.stringify(zadaci));
            return;
        }
    });
         

});

// ZADATAK 2:
// zadatak 2.a, 2.b:
app.get('/dajPodatke', function(req, res) {
    db.godina.findAll({ attributes: ['id', 'nazivGod'], order: [ ['id', 'ASC'] ]}).then(function(godine) {
        db.vjezba.findAll({attributes: ['id', 'naziv'], order: [ ['id', 'ASC'] ]}).then(function(vjezbe) {
            res.json({
                sGodine: JSON.stringify(godine),
                sVjezbe: JSON.stringify(vjezbe)
            });
        });
    });
});

app.post('/addVjezba', function(req, res) {
    var tijelo = req.body;
    
    if(tijelo['naziv'] == undefined) {
        if(tijelo['sGodine'] == undefined  || tijelo['sVjezbe'] == undefined) {
            res.render("greska", {greska:{poruka:"Greška: Odaberite nešto iz select-a, ako nema dodajte!"}});
            return;
        }
        db.godina.findOne({where: {id: tijelo['sGodine']}}).then(function(godina) {
            godina.getVjezbe({where: {id: tijelo['sVjezbe']}}).then(function(vjezbe) {
                if(!vjezbe.length) {
                    db.vjezba.findOne({where: { id: tijelo['sVjezbe']}}).then(function(vjezba) {
                        godina.addVjezba([vjezba]).then(function() {
                            res.redirect("http://localhost:8080/addVjezba.html");
                        });
                    });
                }
                else {
                    res.redirect("http://localhost:8080/addVjezba.html");
                    return;
                }
            });
        });
    }
    else {
        if(tijelo['naziv'] == "") {
            res.render("greska", {greska:{poruka:"Greška: Upišite ime za vježbu!"}});
            return;
        }
        if(tijelo['sGodine'] == undefined) {
            res.render("greska", {greska:{poruka:"Greška: Odaberite nešto iz select-a, ako nema dodajte!"}});
            return;
        }
        var cekirano = false;
        if(tijelo['spirala'] != undefined) cekirano = true;

        db.vjezba.findOne({where: {naziv: tijelo['naziv']}}).then(function(vjezba) {
            if(vjezba == null) {
                db.vjezba.create({naziv: tijelo['naziv'], spirala: cekirano}).then(function(vjezbaa) {
                    db.godina.findOne({where : {id: tijelo['sGodine']}}).then(function(godina) { 
                        vjezbaa.setGodine([godina]);
                        res.redirect('http://localhost:8080/addVjezba.html');
                    });
                });
            }
            else {
                res.render("greska", {greska:{poruka:"Greška: Vježba ovakvog imena je već dodana!"}});
            }
        });
    }
});

// http://localhost:8080/vjezba/:idVjezbe/zadatak
// zadatak 2.c:
app.post('/vjezba/:idVjezbe/zadatak', function(req, res) {
    var tijelo = req.params.idVjezbe;
    tijelo = req.body;
    if(tijelo['sZadatak'] == undefined || tijelo['sVjezbe'] == undefined) {
        res.redirect('http://localhost:8080/addVjezba.html');
        return;
    }
    db.vjezba.findOne({where : {id : tijelo['sVjezbe']}}).then(function(vjezba) {
        db.zadatak.findOne({where: {id : tijelo['sZadatak']}}).then(function(zadatak) {
            vjezba.addZadatak(zadatak);
            res.redirect('http://localhost:8080/addVjezba.html');
        });
    });
});

// pomocni get koji vraca id-ove za sZadatak u formi fPoveziZadatak na osnovu id-a iz sVjezbe, ovo se poziva ajax-om
app.get('/filter/:id', function(req, res) {
    var id = req.params.id;

    db.vjezba.findOne({where: {id: id}}).then(function(vjezba) {
        vjezba.getZadaci({attributes: ['id', 'naziv']}).then(function(zadaci) {
            const Op = Sequelize.Op;
            var ids = [];
            for(var b=0;b<zadaci.length; b++) {
                ids.push(zadaci[b].id);
                
            }
            db.zadatak.findAll({where : {id: {[Op.notIn] : ids}}}).then(function(filterisani) {
                var niz = [];
                if(filterisani == null) {
                    res.contentType("application/json");
                    res.end(JSON.stringify(niz));
                    return;
                }
                for(var i=0; i<filterisani.length; i++) {
                    niz.push({id: filterisani[i].id, naziv: filterisani[i].naziv});
                }
                res.contentType("application/json");
                res.end(JSON.stringify(niz));
            });
        });
    });
});

// zadatak 3.a:
app.post('/student', function(req, res) {
    var json = JSON.parse(JSON.stringify(req.body));
    var idgodina = json.godina;
    var studenti = JSON.parse(JSON.stringify(json.studenti));
    
    // studenti.push({imePrezime: "test", index: "probni"});
    // studenti.push({imePrezime: "etf etfovic", index: "etf"});
    // studenti.push({imePrezime: "test testovic", index: "testni"});

    var listaPromisea1 = [];
    for(var i=0; i<studenti.length; i++) {
        listaPromisea1.push(db.student.findOne({where : {index : studenti[i].index}})); 
    }
    
    var brojacDodanih = 0, brojacUpisanih = 0;
    var listaPromisea2 = [];
    Promise.all(listaPromisea1).then(function(students) {
        for(var j=0; j<students.length; j++) {
            // console.log(students[j]);
            if(students[j] == null) {
                brojacDodanih++;
                brojacUpisanih++;
                listaPromisea2.push(db.student.create({imePrezime: studenti[j].imePrezime, index: studenti[j].index, studentGod: idgodina}));
            }
            else {
                brojacUpisanih++;
                listaPromisea2.push(db.student.findOne({where: {id: students[j].id}}).then(function(student) { student.update({studentGod: idgodina});}));
            }
        }
        return Promise.all(listaPromisea2);

    }).then(function(dodani) {
        db.godina.findOne({where: {id: idgodina}}).then(function(godina) {
            var odgovor = "Dodano je " + brojacDodanih + " novih studenata i upisano " + brojacUpisanih + " na godinu " + godina.nazivGod;
            res.contentType("application/json");
            res.end(JSON.stringify({message: odgovor}));
        });
    });
});

// pomocni get
app.get('/bitbucket/:id', function(req, res) {
    var id = req.params.id;
    db.godina.findOne({where: {id : id}}).then(function(godina) {
        var json = {nazivRepSpi : godina.nazivRepSpi, nazivRepVje : godina.nazivRepVje};
        res.contentType("application/json");
        res.end(JSON.stringify(json));
    });
});


// server osluskuje na portu 8080 (dato postavkom)
app.listen(8080, () => {
    console.log("Server pokrenut, osluškivanje na portu 8080!");
});