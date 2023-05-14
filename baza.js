const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt2017897","root","root",{host:"127.0.0.1",dialect:"mysql",logging:false});
const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

db.predmet = sequelize.import(__dirname + '/baza/predmet.js');
db.grupa = sequelize.import(__dirname + '/baza/grupa.js');
db.aktivnost = sequelize.import(__dirname + '/baza/aktivnost.js');
db.dan = sequelize.import(__dirname + '/baza/dan.js');
db.tip = sequelize.import(__dirname + '/baza/tip.js');
db.student = sequelize.import(__dirname + '/baza/student.js');

db.predmet.hasMany(db.grupa,{as:'grupePredmeti'});
db.predmet.hasMany(db.aktivnost,{as:'aktivnostiPredmeti'});
db.grupa.hasMany(db.aktivnost,{as:'aktivnostiGrupe'});
db.dan.hasMany(db.aktivnost,{as:'aktivnostiDani'});
db.tip.hasMany(db.aktivnost,{as:'aktivnostiTipovi'});

db.studentGrupa=db.student.belongsToMany(db.grupa,{as:'grupe',through:'student_grupa',foreignKey:'studentId'});
db.grupa.belongsToMany(db.student,{as:'studenti',through:'student_grupa',foreignKey:'grupaId'});

module.exports=db;