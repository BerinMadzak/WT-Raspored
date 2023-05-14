let predmeti = [];
let aktivnosti = [];
let tipovi = [];
let dani = [];
let grupe = [];

let naziv = document.getElementById("naziv");
let predmet = document.getElementById("predmet");
let grupa = document.getElementById("grupa");
let tip = document.getElementById("tip");
let pocetak = document.getElementById("pocetak");
let kraj = document.getElementById("kraj");
let dan = document.getElementById("dan");

let poruka = document.getElementById("poruka");

ucitajSelecte();

let xhttp1 = new XMLHttpRequest();
xhttp1.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        ucitajPredmete(this);
    }
}
xhttp1.open("GET","http://localhost:3000/v2/predmeti",true);
xhttp1.send();

let xhttp2 = new XMLHttpRequest();
xhttp2.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        ucitajAktivnosti(this);
    }
}
xhttp2.open("GET","http://localhost:3000/v2/aktivnosti",true);
xhttp2.send();

function ucitajSelecte()
{
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            ucitajDane(this);
        }
    }
    xhttp.open("GET","http://localhost:3000/v2/dani",true);
    xhttp.send();

    let xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            ucitajTipove(this);
        }
    }
    xhttp2.open("GET","http://localhost:3000/v2/tipovi",true);
    xhttp2.send();
    
    let xhttp3 = new XMLHttpRequest();
    xhttp3.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            ucitajGrupe(this);
        }
    }
    xhttp3.open("GET","http://localhost:3000/v2/grupe",true);
    xhttp3.send();
}

function ucitajDane(xhttp)
{
    var json = JSON.parse(xhttp.responseText);
    for(var i = 0; i < json.length; i++)
    {
        let select = document.createElement('option');
        select.innerHTML = json[i]['naziv'];
        dan.appendChild(select);
        dani.push(json[i]);
    }
}

function ucitajTipove(xhttp)
{
    var json = JSON.parse(xhttp.responseText);
    for(var i = 0; i < json.length; i++)
    {
        let select = document.createElement('option');
        select.innerHTML = json[i]['naziv'];
        tip.appendChild(select);
        tipovi.push(json[i]);
    }
}

function ucitajGrupe(xhttp)
{
    var json = JSON.parse(xhttp.responseText);
    for(var i = 0; i < json.length; i++)
    {
        let select = document.createElement('option');
        select.innerHTML = json[i]['naziv'];
        grupa.appendChild(select);
        grupe.push(json[i]);
    }
}

function ucitajPredmete(xhttp)
{
    predmeti = [];
    var json = JSON.parse(xhttp.responseText);
    for(var i = 0; i < json.length; i++)
    {
        predmeti.push(json[i]["naziv"]);
    }
}

function ucitajAktivnosti(xhttp)
{
    aktivnosti = [];
    var json = JSON.parse(xhttp.responseText);
    for(var i = 0; i < json.length; i++)
    {
        aktivnosti.push(json[i]);
    }
}

function dodajAktivnost()
{
    let json = {"naziv":predmet.value};
    let tipP,danP,grupaP;
    tipovi.forEach(tipV =>{
        if(tipV['naziv'] == tip.value) tipP = tipV['id'];
    });
    dani.forEach(danV =>{
        if(danV['naziv'] == dan.value) danP = danV['id'];
    });
    grupe.forEach(grupaV =>{
        if(grupaV['naziv'] == grupa.value) grupaP = grupaV['id'];
    });
    let xhttp5 = new XMLHttpRequest();  
    xhttp5.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let xhttp6 = new XMLHttpRequest();
            xhttp6.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    let json2 = JSON.parse(this.responseText);
                    let json3 = {"naziv":naziv.value,"pocetak":pocetak.value,"kraj":kraj.value,"danId":danP,"tipId":tipP,"predmetId":json2['id'],"grupaId":grupaP};
                    let xhttp7 = new XMLHttpRequest();
                    xhttp7.onreadystatechange = function(){
                        poruka.innerHTML = this.response;
                    }
                    xhttp7.open("POST","http://localhost:3000/v2/aktivnost/",true);
                    xhttp7.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    xhttp7.send(JSON.stringify(json3));  
                }
            }
            xhttp6.open("GET","http://localhost:3000/v2/predmet/" + predmet.value,true);
            xhttp6.send();  
        }
    }
    xhttp5.open("POST","http://localhost:3000/v2/predmet/",true);
    xhttp5.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp5.send(JSON.stringify(json));
}

function dodajPredmet(predmet)
{
    let json = {"naziv":predmet};
    let xhttp = new XMLHttpRequest();  
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            predmeti.push(predmet);
        }
    }
    xhttp.open("POST","http://localhost:3000/v2/predmet",true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(json));
}

function obrisiPredmet(predmet)
{
    let xhttp = new XMLHttpRequest();  
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            predmeti.pop();
        }
    }
    xhttp.open("DELETE","http://localhost:3000/v2/predmet/" + predmet,true);
    xhttp.send();
}