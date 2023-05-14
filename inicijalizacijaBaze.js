const { predmet } = require('./baza.js');
const db = require('./baza.js');
db.sequelize.sync({force:true}).then(function(){
    inicijalizacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});

function inicijalizacija(){
    var predmetiPromise = [];
    var daniPromise = [];
    var tipoviPromise = [];
    var studentiPromise = [];
    var grupePromise = [];
    var aktivnostiPromise = [];
    return new Promise(function(resolve,reject){
        predmetiPromise.push(db.predmet.create({naziv:'WT'}));
        predmetiPromise.push(db.predmet.create({naziv:'RMA'}));
        Promise.all(predmetiPromise).then(function(predmeti){
            var wt = predmeti.filter(function(a){return a.naziv == 'WT'})[0];
            var rma = predmeti.filter(function(a){return a.naziv == 'RMA'})[0];

            grupePromise.push(db.grupa.create({naziv:'WTgrupa1'}).then(function(g){
                wt.setGrupePredmeti(g);
                return new Promise(function(resolve,reject){resolve(g);});
            }));
            grupePromise.push(db.grupa.create({naziv:'WTgrupa2'}).then(function(g){
                wt.setGrupePredmeti(g);
                return new Promise(function(resolve,reject){resolve(g);});
            }));
            grupePromise.push(db.grupa.create({naziv:'RMAgrupa1'}).then(function(g){
                rma.setGrupePredmeti(g);
                return new Promise(function(resolve,reject){resolve(g);});
            }));
            Promise.all(grupePromise).then(function(grupe){
                var grupa1 = grupe.filter(function(a){return a.naziv == 'WTgrupa1'})[0];

                tipoviPromise.push(db.tip.create({naziv:'Predavanje'}));
                tipoviPromise.push(db.tip.create({naziv:'Vježbe'}));
                Promise.all(tipoviPromise).then(function(tipovi){
                    var tip = tipovi.filter(function(a){return a.naziv == 'Predavanje'})[0];

                    daniPromise.push(db.dan.create({naziv:'Ponedjeljak'}));
                    daniPromise.push(db.dan.create({naziv:'Utorak'}));
                    daniPromise.push(db.dan.create({naziv:'Srijeda'}));
                    Promise.all(daniPromise).then(function(dani){
                        var dan = dani.filter(function(a){return a.naziv == 'Ponedjeljak'})[0];

                        studentiPromise.push(db.student.create({ime:'Berin Madžak',index:17897}).then(function(s){
                            return s.addGrupe(grupa1).then(function(){
                                return new Promise(function(resolve,reject){resolve(s);});
                            });
                        }));
                        Promise.all(studentiPromise).then(function(studenti){
                            var student = studenti.filter(function(a){return a.index == 17897})[0];

                            aktivnostiPromise.push(db.aktivnost.create({naziv:'Aktivnost1',pocetak:8,kraj:10}).then(function(a){
                                return wt.setAktivnostiPredmeti(a).then(function(){
                                    return grupa1.setAktivnostiGrupe(a).then(function(){
                                        return dan.setAktivnostiDani(a).then(function(){
                                            return tip.setAktivnostiTipovi(a).then(function(){
                                                return new Promise(function(resolve,reject){resolve(a);});
                                            });
                                        });
                                    });
                                });          
                            }));
                            Promise.all(aktivnostiPromise).then(function(aktivnosti){
                                resolve(aktivnosti);
                            }).catch(function(err){console.log("Aktivnosti greska "+err);});;
                        }).catch(function(err){console.log("Studenti greska "+err);});
                    }).catch(function(err){console.log("Dani greska "+err);});;
                }).catch(function(err){console.log("Tipovi greska "+err);});;
            }).catch(function(err){console.log("Grupe greska "+err);});;
        }).catch(function(err){console.log("Predmeti greska "+err);});;
    });
}