/* Veze između modela (datoteka db.js):
student​ -- više na jedan -- ​ godina​ , fk studentGod, as studenti
godina​ ​ -- više na više -- ​ ​ vjezba​ , mt ​ godina_vjezba​ , fk idgodina i idvjezba, as godine i vjezbe
vjezba ​ -- više na više -- ​ ​ zadatak​ , mt ​ vjezba_zadatak​ , fk idvjezba i idzadatak, as vjezbe i zadaci
fk - foreign key, as - alias, mt - međutabela */

const Sequelize = require('sequelize');
const sequelize = new Sequelize('wt2018', 'root', 'root', {
    host : 'localhost', 
    dialect : 'mysql',
    logging : false
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.student = sequelize.import(__dirname + '/student.js');
db.godina = sequelize.import(__dirname + '/godina.js');
db.vjezba = sequelize.import(__dirname + '/vjezba.js');
db.zadatak = sequelize.import(__dirname + '/zadatak.js');

//relacije
// Veza 1-n jedna godina može imati više studenata
db.godina.hasMany(db.student,{foreignKey: 'studentGod', as: 'studenti'});

// Veza više na više (n-m): godina moze imati vise vjezbi, a vjezba vise godina
db.godinaVjezba = db.vjezba.belongsToMany(db.godina,{as: {singular: 'godina', plural: 'godine'}, through:'godina_vjezba',foreignKey:'idvjezba'});
db.godina.belongsToMany(db.vjezba,{as: {singular: 'vjezba', plural: 'vjezbe'},through:'godina_vjezba',foreignKey:'idgodina'});

// Veza više na više (n-m): vjezba moze imati vise zadataka, a zadatak vise vjezbi
db.vjezbaZadatak = db.zadatak.belongsToMany(db.vjezba,{as: {singular: 'vjezba', plural: 'vjezbe'}, through:'vjezba_zadatak',foreignKey:'idzadatak'});
db.vjezba.belongsToMany(db.zadatak,{as: {singular: 'zadatak', plural: 'zadaci'}, through:'vjezba_zadatak',foreignKey:'idvjezba'});

module.exports = db;