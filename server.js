const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const db = require('./baza.js');
const { grupa } = require('./baza.js');

/*

    Treba pokrenuti inicijalizacijaBaze.js da se ubace početni podaci u bazu

*/

db.sequelize.sync();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public/html'));
app.get('/v1/predmeti', function(req, res){
    fs.readFile('predmeti.txt', 'utf-8', (err,data)=>{
        if(err)
        {
            return console.error(err);
        }

        var linije = data.split('\n');
        var predmeti = [];
        
        for(var i = 0; i < linije.length-1; i++)
        {
            var objekat = {};
            objekat['naziv'] = linije[i];
            predmeti.push(objekat);
        }

        var json = JSON.stringify(predmeti);
        res.end(json);
    });
});
app.get('/v1/aktivnosti', function(req, res){
    fs.readFile('aktivnosti.txt', 'utf-8', (err,data)=>{
        if(err)
        {
            return console.error(err);
        }

        var linije = data.split('\n');
        var predmeti = [];
        
        for(var i = 0; i < linije.length-1; i++)
        {
            var vrijednosti = linije[i].split(',');
            var objekat = {};
            objekat['naziv'] = vrijednosti[0];
            objekat['tip'] = vrijednosti[1];
            objekat['pocetak'] = vrijednosti[2];
            objekat['kraj'] = vrijednosti[3];
            objekat['dan'] = vrijednosti[4];
            predmeti.push(objekat);
        }

        var json = JSON.stringify(predmeti);
        res.end(json);
    });
});
app.get('/v1/predmet/:naziv/aktivnost', function(req, res){
    var predmet = req.params.naziv;
    fs.readFile('aktivnosti.txt', 'utf-8', (err,data)=>{
        if(err)
        {
            return console.error(err);
        }

        var linije = data.split('\n');
        var predmeti = [];
        
        for(var i = 0; i < linije.length-1; i++)
        {
            var vrijednosti = linije[i].split(',');
            var objekat = {};
            if(vrijednosti[0] == predmet)
            {
                objekat['naziv'] = vrijednosti[0];
                objekat['tip'] = vrijednosti[1];
                objekat['pocetak'] = vrijednosti[2];
                objekat['kraj'] = vrijednosti[3];
                objekat['dan'] = vrijednosti[4];
                predmeti.push(objekat);
            }
        }

        var json = JSON.stringify(predmeti);
        res.end(json);
    });
});
app.post('/v1/predmet', function(req,res){
    let naziv = req.body['naziv'];
    let nazivTxt = naziv + '\n';
    let postoji = false;
    fs.readFile('predmeti.txt', 'utf-8', (err,data)=>{
        if(err)
        {
            return console.error(err);
        }

        var linije = data.split('\n');

        for(var i = 0; i < linije.length; i++)
        {
            if(linije[i] == naziv)
            {
                res.end('Naziv predmeta postoji!');
                postoji = true;
            }
        }

        if(!postoji)
        {
            fs.appendFile('predmeti.txt',nazivTxt,function(err){
                if(err) throw err;
                res.end('Uspješno dodan predmet!');
            });
        }
    });
});
app.post('/v1/aktivnost', function(req,res){
    let dani = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja']
    let naziv = req.body['naziv'];
    let tip = req.body['tip'];
    let pocetak = parseFloat(req.body['pocetak']);
    let kraj = parseFloat(req.body['kraj']);
    let dan = req.body['dan'];

    let validan = true;
    if(naziv.length == 0 || tip.length == 0 || !dani.includes(dan)) validan = false;
    if(pocetak < 0 || pocetak > 23 || kraj < 0 || kraj > 23 || kraj <= pocetak) validan = false;

    if(!validan) res.end('Aktivnost nije validna!');
    else
    {
        let aktivnost = naziv + ',' + tip + ',' + pocetak + ',' + kraj + ',' + dan + '\n';
        fs.appendFile('aktivnosti.txt', aktivnost,function(err){
            if(err) throw err;
            res.end('Uspješno dodana aktivnost!');
        });
    }
});
app.delete('/v1/predmet/:naziv', function(req,res){
    let naziv = req.params.naziv;

    fs.readFile('predmeti.txt', 'utf-8', function(err, data){
        if(err) throw err;

        let predmeti = data.split('\n');
        let obrisan = false;
        let novi = "";
        for(let i = 0; i < predmeti.length-1; i++)
        {
            if(predmeti[i] != naziv) novi += predmeti[i] + '\n';
            else obrisan = true;
        }
        fs.writeFile('predmeti.txt', novi, function(err, data){
            if(err || !obrisan) res.end('Greška - predmet nije obrisan!');
            else res.end('Uspješno obrisan predmet!');
        });
    })
});
app.delete('/v1/aktivnost/:naziv', function(req,res){
    let naziv = req.params.naziv;

    fs.readFile('aktivnosti.txt', 'utf-8', function(err, data){
        if(err) throw err;

        let aktivnosti = data.split('\n');
        let obrisan = false;
        let novi = "";
        for(let i = 0; i < aktivnosti.length-1; i++)
        {
            let nazivAktivnosti = aktivnosti[i].split(',')[0];
            if(nazivAktivnosti != naziv) novi += aktivnosti[i] + '\n';
            else obrisan = true;
        }
        fs.writeFile('aktivnosti.txt', novi, function(err, data){
            if(err || !obrisan) res.end('Greška - aktivnost nije obrisana!');
            else res.end('Uspješno obrisana aktivnost!');
        });
    })
});
app.delete('/v1/all', function(req,res){
    fs.truncate('aktivnosti.txt', 0, function(){
    
    });
    fs.truncate('predmeti.txt', 0, function(){

    }) ;
    res.end('Uspješno obrisan sadržaj datoteka!');
});
app.get('/v2/predmeti', function(req, res){
    db.predmet.findAll().then(function(list){
        let niz = [];
        list.forEach(el =>
        {
            var objekat = {};
            objekat['id'] = el.id;
            objekat['naziv'] = el.naziv;
            niz.push(objekat);
        });

        var json = JSON.stringify(niz);
        res.end(json);
    });
});
app.get('/v2/predmet/:naziv', function(req, res){
    let naziv = req.params.naziv;
    db.predmet.findOne({where:{naziv:naziv}}).then(function(rez){      
        var objekat = {};
        objekat['id'] = rez.id;
        objekat['naziv'] = rez.naziv;
        var json = JSON.stringify(objekat);
        res.end(json);
    });
});
app.post('/v2/predmet', function(req, res){
    let naziv = req.body['naziv'];
    db.predmet.findOrCreate({where:{naziv:naziv}}).then(function(predmet){
        res.end("Uspjesno dodan predmet!");
    });
});
app.delete('/v2/predmet/:id', function(req, res){
    let id = req.params.id;
    db.predmet.destroy({where:{id:id}}).then(function(){
        res.end("Uspjesno obrisan predmet!");
    });
});
app.put('/v2/predmet/:id', function(req, res){
    let id = req.params.id;
    let naziv = req.body['naziv']
    db.predmet.update({naziv:naziv},{where:{id:id}}).then(function(rez){
        res.end("Uspjesno izmjenjen predmet!");
    });
});
app.get('/v2/grupe', function(req, res){
    db.grupa.findAll().then(function(list){
        let niz = [];
        list.forEach(el =>
        {
            var objekat = {};
            objekat['id'] = el.id;
            objekat['naziv'] = el.naziv;
            objekat['predmetId'] = el.predmetId;
            niz.push(objekat);
        });

        var json = JSON.stringify(niz);
        res.end(json);
    });
});
app.get('/v2/grupa/:naziv', function(req, res){
    let naziv = req.params.naziv;
    db.grupa.findOne({where:{naziv:naziv}}).then(function(rez){      
        var objekat = {};
        objekat['id'] = rez.id;
        objekat['naziv'] = rez.naziv;
        objekat['predmetId'] = rez.predmetId;
        var json = JSON.stringify(objekat);
        res.end(json);
    });
});
app.post('/v2/grupa', function(req, res){
    let naziv = req.body['naziv'];
    let predmetId = req.body['predmetId'];
    db.grupa.findOrCreate({where:{naziv:naziv,predmetId:predmetId}}).then(function(){
        res.end("Uspjesno dodana grupa!");
    });
});
app.delete('/v2/grupa/:id', function(req, res){
    let id = req.params.id;
    db.grupa.destroy({where:{id:id}}).then(function(){
        res.end("Uspjesno obrisana grupa!");
    });
});
app.put('/v2/grupa/:id', function(req, res){
    let id = req.params.id;
    let naziv = req.body['naziv']
    let predmetId = req.body['predmetId'];
    db.grupa.update({naziv:naziv,predmetId:predmetId},{where:{id:id}}).then(function(rez){
        res.end("Uspjesno izmjenjena grupa!");
    });
});
app.get('/v2/dani', function(req, res){
    db.dan.findAll().then(function(list){
        let niz = [];
        list.forEach(el =>
        {
            var objekat = {};
            objekat['id'] = el.id;
            objekat['naziv'] = el.naziv;
            niz.push(objekat);
        });

        var json = JSON.stringify(niz);
        res.end(json);
    });
});
app.get('/v2/dan/:naziv', function(req, res){
    let naziv = req.params.naziv;
    db.dan.findOne({where:{naziv:naziv}}).then(function(rez){      
        var objekat = {};
        objekat['id'] = rez.id;
        objekat['naziv'] = rez.naziv;
        var json = JSON.stringify(objekat);
        res.end(json);
    });
});
app.post('/v2/dan', function(req, res){
    let naziv = req.body['naziv'];
    db.dan.findOrCreate({where:{naziv:naziv}}).then(function(){
        res.end("Uspjesno dodan dan!");
    });
});
app.delete('/v2/dan/:id', function(req, res){
    let id = req.params.id;
    db.dan.destroy({where:{id:id}}).then(function(){
        res.end("Uspjesno obrisan dan!");
    });
});
app.put('/v2/dan/:id', function(req, res){
    let id = req.params.id;
    let naziv = req.body['naziv']
    db.dan.update({naziv:naziv},{where:{id:id}}).then(function(rez){
        res.end("Uspjesno izmjenjen dan!");
    });
});
app.get('/v2/tipovi', function(req, res){
    db.tip.findAll().then(function(list){
        let niz = [];
        list.forEach(el =>
        {
            var objekat = {};
            objekat['id'] = el.id;
            objekat['naziv'] = el.naziv;
            niz.push(objekat);
        });

        var json = JSON.stringify(niz);
        res.end(json);
    });
});
app.get('/v2/tip/:naziv', function(req, res){
    let naziv = req.params.naziv;
    db.tip.findOne({where:{naziv:naziv}}).then(function(rez){      
        var objekat = {};
        objekat['id'] = rez.id;
        objekat['naziv'] = rez.naziv;
        var json = JSON.stringify(objekat);
        res.end(json);
    });
});
app.post('/v2/tip', function(req, res){
    let naziv = req.body['naziv'];
    db.tip.findOrCreate({where:{naziv:naziv}}).then(function(){
        res.end("Uspjesno dodan tip!");
    });
});
app.delete('/v2/tip/:id', function(req, res){
    let id = req.params.id;
    db.tip.destroy({where:{id:id}}).then(function(){
        res.end("Uspjesno obrisan tip!");
    });
});
app.put('/v2/tip/:id', function(req, res){
    let id = req.params.id;
    let naziv = req.body['naziv']
    db.tip.update({naziv:naziv},{where:{id:id}}).then(function(rez){
        res.end("Uspjesno izmjenjen tip!");
    });
});
app.get('/v2/studenti', function(req, res){
    db.student.findAll().then(function(list){
        let niz = [];
        list.forEach(el =>
        {
            var objekat = {};
            objekat['id'] = el.id;
            objekat['ime'] = el.ime;
            objekat['index'] = el.index;
            niz.push(objekat);
        });

        var json = JSON.stringify(niz);
        res.end(json);
    });
});
app.get('/v2/student/:index', function(req, res){
    let index = req.params.index;
    db.student.findOne({where:{index:index}}).then(function(rez){      
        var objekat = {};
        objekat['id'] = rez.id;
        objekat['ime'] = rez.ime;
        objekat['index'] = rez.index;
        var json = JSON.stringify(objekat);
        res.end(json);
    });
});
app.post('/v2/student', function(req, res){
    let ime = req.body['ime'];
    let index = req.body['index'];
    db.student.findOne({where:{index:index}}).then(function(rez){
        if(rez == null)
        {
            db.student.findOrCreate({where:{ime:ime,index:index}}).then(function(){
                res.end("Uspjesno dodan student!");
            });
        }
        else
        {
            res.end("Student nije dodan!");
        }
    })
});
app.post('/v2/studentLista', function(req, res){
    let list = req.body;
    let odgovor = "";
    for(let i = 0; i < list.length; i++)
    {
        let student = list[i];
        let ime = student['ime'];
        let index = student['index'];
        let grupa = student['grupa'];
        db.grupa.findOne({where:{naziv:grupa}}).then(function(gr){       
            db.student.findOne({where:{index:index}}).then(function(rez){
                if(rez == null)
                {
                    db.student.findOrCreate({where:{ime:ime,index:index}}).then(function(rez){
                        db.grupa.findById(gr.id).then(function(grupa){
                            rez[0].addGrupe(grupa).then(function(){
                                if(i == list.length-1){ res.end(odgovor);}
                            });
                        });
                    });
                }
                else
                {
                    if(rez.ime == ime)
                    {
                        db.grupa.findById(gr.id).then(function(grupa){
                            rez.getGrupe().then(function(list){
                                let gtr;
                                list.forEach(val =>{
                                    if(val.predmetId == grupa.predmetId) gtr = val;
                                });
                                rez.removeGrupe(gtr).then(function(){
                                    rez.addGrupe(grupa).then(function(){
                                        if(i == list.length-1) res.end(odgovor);
                                    });
                                })
                            });
                        });
                    }
                    else
                    {
                        odgovor += "Student " + ime + " nije kreiran jer postoji student " + rez.ime + " sa istim indexom " + index + '\n';
                        if(i == list.length-1) res.end(odgovor);
                    }
                }
            });
        });
    }
});
app.delete('/v2/student/:id', function(req, res){
    let id = req.params.id;
    db.student.destroy({where:{id:id}}).then(function(){
        res.end("Uspjesno obrisan student!");
    });
});
app.put('/v2/student/:id', function(req, res){
    let id = req.params.id;
    let ime = req.body['ime'];
    let index = req.body['index'];
    db.student.update({ime:ime,index:index},{where:{id:id}}).then(function(rez){
        res.end("Uspjesno izmjenjen student!");
    });
});
app.get('/v2/aktivnosti', function(req, res){
    db.aktivnost.findAll().then(function(list){
        let niz = [];
        list.forEach(el =>
        {
            var objekat = {};
            objekat['id'] = el.id;
            objekat['naziv'] = el.naziv;
            objekat['pocetak'] = el.pocetak;
            objekat['kraj'] = el.kraj;
            objekat['predmetId'] = el.predmetId;
            objekat['grupaId'] = el.grupaId;
            objekat['danId'] = el.danId;
            objekat['tipId'] = el.tipId;
            niz.push(objekat);
        });

        var json = JSON.stringify(niz);
        res.end(json);
    });
});
app.get('/v2/aktivnost/:id', function(req, res){
    let id = req.params.id;
    db.aktivnost.findById(id).then(function(rez){      
        var objekat = {};
        objekat['naziv'] = el.naziv;
        objekat['pocetak'] = el.pocetak;
        objekat['kraj'] = el.kraj;
        objekat['predmetId'] = el.predmetId;
        objekat['grupaId'] = el.grupaId;
        objekat['danId'] = el.danId;
        objekat['tipId'] = el.tipId;
        var json = JSON.stringify(objekat);
        res.end(json);
    });
});
app.post('/v2/aktivnost', function(req, res){
    let naziv = req.body['naziv'];
    let pocetak = req.body['pocetak'];
    let kraj = req.body['kraj'];
    let predmetId = req.body['predmetId'];
    let grupaId = req.body['grupaId'];
    let danId = req.body['danId'];
    let tipId = req.body['tipId'];
    db.aktivnost.findOrCreate({where:{naziv:naziv,pocetak:pocetak,kraj:kraj,predmetId:predmetId,
    grupaId:grupaId,danId:danId,tipId:tipId}}).then(function(){
        res.end("Uspjesno dodana aktivnost!");
    });
});
app.delete('/v2/aktivnost/:id', function(req, res){
    let id = req.params.id;
    db.aktivnost.destroy({where:{id:id}}).then(function(){
        res.end("Uspjesno obrisana aktivnost!");
    });
});
app.put('/v2/aktivnost/:id', function(req, res){
    let id = req.params.id;
    let naziv = req.body['naziv'];
    let pocetak = req.body['pocetak'];
    let kraj = req.body['kraj'];
    let predmetId = req.body['predmetId'];
    let grupaId = req.body['grupaId'];
    let danId = req.body['danId'];
    let tipId = req.body['tipId'];
    db.student.update({naziv:naziv,pocetak:pocetak,kraj:kraj,predmetId:predmetId,
        grupaId:grupaId,danId:danId,tipId:tipId},{where:{id:id}}).then(function(rez){
        res.end("Uspjesno izmjenjena aktivnost!");
    });
});
app.listen(3000);