let assert = chai.assert;
describe('Raspored', function(){
    describe('iscrtajRaspored()', function(){
        it('Kreiranje rasporeda', function(){
            Raspored.iscrtajRaspored(document.getElementById("test"), ["Ponedjeljak", "Utorak", "Srijeda"], 8, 20);
            let tabele = document.getElementsByTagName("table");
            let tabela = tabele[tabele.length-1];
            assert.equal(tabela.nodeName, "TABLE");
        });
        it('Provjera ispravnosti broja redova i kolona', function(){
            Raspored.iscrtajRaspored(document.getElementById("test"), ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 0, 23);
            let tabele = document.getElementsByTagName("table");
            let tabela = tabele[tabele.length-1];
            let redovi = tabela.getElementsByTagName("tr");
            assert.equal(redovi.length, 6); //Red sati + 5 dana
            assert.equal(redovi[1].childNodes.length, 47); //Kolona dana + 46 kolona za svako pola sata
        });
        it('Provjera ispravnosti broja redova i kolona', function(){
            Raspored.iscrtajRaspored(document.getElementById("test"), ["Ponedjeljak", "Utorak", "Srijeda"], 1, 4);
            let tabele = document.getElementsByTagName("table");
            let tabela = tabele[tabele.length-1];
            let redovi = tabela.getElementsByTagName("tr");
            assert.equal(redovi.length, 4);
            assert.equal(redovi[1].childNodes.length, 7);
        });
        it('Provjera da se ispisuju samo traženi sati (0,2,4,6,8,10,12,15,17,19,21,23)', function(){
            const moguciSati=['0:00','2:00','4:00','6:00','8:00','10:00','12:00','15:00','17:00','19:00','21:00','23:00',''];
            Raspored.iscrtajRaspored(document.getElementById("test"), ["Ponedjeljak", "Utorak", "Srijeda"], 0, 23);
            let tabele = document.getElementsByTagName("table");
            let tabela = tabele[tabele.length-1];
            let redovi = tabela.getElementsByTagName("tr");
            let sati = redovi[0];
            for(var i = 0; i < sati.childNodes.length; i++){
                assert.equal(moguciSati.includes(sati.childNodes[i].innerText), true);   
            }
        });
        it('Provjera da se zadnji sat ne ispisuje', function(){
            Raspored.iscrtajRaspored(document.getElementById("test"), ["Ponedjeljak", "Utorak", "Srijeda"], 10, 23);
            let tabele = document.getElementsByTagName("table");
            let tabela = tabele[tabele.length-1];
            let redovi = tabela.getElementsByTagName("tr");
            let sati = redovi[0];
            assert.equal(sati.lastChild.innerText == "", true);
        });
        it('Greška pri negativnom vremenu', function(){
            Raspored.iscrtajRaspored(document.getElementById("test"), ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 1, -15);
            let pList = document.getElementById("test").getElementsByTagName("p");
            let p = pList[pList.length-1];
            assert.equal(p.innerText == "Greška", true);
        });
        it('Greška pri vremenu koje nije cijeli broj', function(){
            Raspored.iscrtajRaspored(document.getElementById("test"), ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 1, 5.4);
            let pList = document.getElementById("test").getElementsByTagName("p");
            let p = pList[pList.length-1];
            assert.equal(p.innerText == "Greška", true);
        });
        it('Greška pri negativnom vremenu koje nije cijeli broj', function(){
            Raspored.iscrtajRaspored(document.getElementById("test"), ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], -10, -5.4);
            let pList = document.getElementById("test").getElementsByTagName("p");
            let p = pList[pList.length-1];
            assert.equal(p.innerText == "Greška", true);
        });
        it('Greška pri početnom vremenu većem od krajnjeg', function(){
            Raspored.iscrtajRaspored(document.getElementById("test"), ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 10, 8);
            let pList = document.getElementById("test").getElementsByTagName("p");
            let p = pList[pList.length-1];
            assert.equal(p.innerText == "Greška", true);
        });
        it('Greška pri početnom vremenu jednakom krajnjem', function(){
            Raspored.iscrtajRaspored(document.getElementById("test"), ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 10, 10);
            let pList = document.getElementById("test").getElementsByTagName("p");
            let p = pList[pList.length-1];
            assert.equal(p.innerText == "Greška", true);
        });
    });
    describe('dodajAktivnost()', function(){
        it('Dodavanje aktivnosti', function(){
            let div = document.createElement("div");
            let body = document.querySelector("body");
            let list = body.getElementsByTagName("div");
            let testDiv = list[list.length-1];
            body.insertBefore(div, testDiv);
            Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 21);
            Raspored.dodajAktivnost(div, "WT", "predavanje", 9, 12, "Utorak");
            let tabele = document.getElementsByTagName("table");
            let tabela = tabele[tabele.length-1];
            let red = tabela.getElementsByTagName("tr")[2];
            let polja = red.getElementsByTagName("td");
            assert.equal(polja[2].colSpan, 6);
            assert.equal(polja[2].getElementsByTagName("h1")[0].innerHTML, "WT");
            assert.equal(polja[2].getElementsByTagName("h2")[0].innerHTML, "predavanje");
        });
        it('Dodavanje susjednih aktivnosti', function(){
            let div = document.createElement("div");
            let body = document.querySelector("body");
            let list = body.getElementsByTagName("div");
            let testDiv = list[list.length-1];
            body.insertBefore(div, testDiv);
            Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 21);
            Raspored.dodajAktivnost(div, "WT", "predavanje", 9, 12, "Utorak");
            Raspored.dodajAktivnost(div, "DM", "tutorijal", 12, 13.5, "Utorak");
            let tabele = document.getElementsByTagName("table");
            let tabela = tabele[tabele.length-1];
            let red = tabela.getElementsByTagName("tr")[2];
            let polja = red.getElementsByTagName("td");
            assert.equal(polja[2].colSpan, 6);
            assert.equal(polja[2].getElementsByTagName("h1")[0].innerHTML, "WT");
            assert.equal(polja[3].colSpan, 3);
            assert.equal(polja[3].getElementsByTagName("h1")[0].innerHTML, "DM");
        });
        it('Dodavanje aktivnosti sa početkom i krajem u polovici sata', function(){
            let div = document.createElement("div");
            let body = document.querySelector("body");
            let list = body.getElementsByTagName("div");
            let testDiv = list[list.length-1];
            body.insertBefore(div, testDiv);
            Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 21);
            Raspored.dodajAktivnost(div, "WT", "predavanje", 9.5, 12.5, "Utorak");
            let tabele = document.getElementsByTagName("table");
            let tabela = tabele[tabele.length-1];
            let red = tabela.getElementsByTagName("tr")[2];
            let polja = red.getElementsByTagName("td");
            assert.equal(polja[3].colSpan, 6);
            assert.equal(polja[3].getElementsByTagName("h1")[0].innerHTML, "WT");
            assert.equal(polja[3].getElementsByTagName("h2")[0].innerHTML, "predavanje");
            assert.equal(polja[3].style.borderLeftStyle, "dashed");
            assert.equal(polja[3].style.borderRightStyle, "dashed");
        });
        it('Dodavanje aktivnosti na rubu rasporeda', function(){
            let div = document.createElement("div");
            let body = document.querySelector("body");
            let list = body.getElementsByTagName("div");
            let testDiv = list[list.length-1];
            body.insertBefore(div, testDiv);
            Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 21);
            Raspored.dodajAktivnost(div, "WT", "predavanje", 8, 11, "Ponedjeljak");
            Raspored.dodajAktivnost(div, "DM", "tutorijal", 19.5, 21, "Ponedjeljak");
            let tabele = document.getElementsByTagName("table");
            let tabela = tabele[tabele.length-1];
            let red = tabela.getElementsByTagName("tr")[1];
            let polja = red.getElementsByTagName("td");
            assert.equal(polja[0].colSpan, 6);
            assert.equal(polja[0].getElementsByTagName("h1")[0].innerHTML, "WT");
            assert.equal(polja[0].getElementsByTagName("h2")[0].innerHTML, "predavanje");
            assert.equal(polja[18].colSpan, 3);
            assert.equal(polja[18].getElementsByTagName("h1")[0].innerHTML, "DM");
            assert.equal(polja[18].getElementsByTagName("h2")[0].innerHTML, "tutorijal");
        });
        it('Dodavanje aktivnosti veličine čitavog reda i jednog polja', function(){
            let div = document.createElement("div");
            let body = document.querySelector("body");
            let list = body.getElementsByTagName("div");
            let testDiv = list[list.length-1];
            body.insertBefore(div, testDiv);
            Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 21);
            Raspored.dodajAktivnost(div, "WT", "predavanje", 8, 21, "Ponedjeljak");
            Raspored.dodajAktivnost(div, "DM", "tutorijal", 9, 9.5, "Utorak");
            let tabele = document.getElementsByTagName("table");
            let tabela = tabele[tabele.length-1];
            let red = tabela.getElementsByTagName("tr")[1];
            let red2 = tabela.getElementsByTagName("tr")[2];
            let polja = red.getElementsByTagName("td");
            let polja2 = red2.getElementsByTagName("td");
            assert.equal(polja[0].colSpan, 26);
            assert.equal(polja[0].getElementsByTagName("h1")[0].innerHTML, "WT");
            assert.equal(polja[0].getElementsByTagName("h2")[0].innerHTML, "predavanje");
            assert.equal(polja2[2].colSpan, 1);
            assert.equal(polja2[2].getElementsByTagName("h1")[0].innerHTML, "DM");
            assert.equal(polja2[2].getElementsByTagName("h2")[0].innerHTML, "tutorijal");
        });
        it('Raspored ne postoji greška', function(){
            let div = document.createElement("div");
            let body = document.querySelector("body");
            let list = body.getElementsByTagName("div");
            let testDiv = list[list.length-1];
            body.insertBefore(div, testDiv);
            Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], -1, 21);
            let msg = Raspored.dodajAktivnost(div, "WT", "predavanje", 8, 21, "Ponedjeljak");
            assert.equal(msg, "Greška - raspored nije kreiran");
        });
        it('Dan ne postoji', function(){
            let div = document.createElement("div");
            let body = document.querySelector("body");
            let list = body.getElementsByTagName("div");
            let testDiv = list[list.length-1];
            body.insertBefore(div, testDiv);
            Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 1, 21);
            let msg = Raspored.dodajAktivnost(div, "WT", "predavanje", 8, 21, "Dan");
            assert.equal(msg, "Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
        });
        it('Vrijeme ne postoji', function(){
            let div = document.createElement("div");
            let body = document.querySelector("body");
            let list = body.getElementsByTagName("div");
            let testDiv = list[list.length-1];
            body.insertBefore(div, testDiv);
            Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 21);
            let msg = Raspored.dodajAktivnost(div, "WT", "predavanje", 4, 21, "Utorak");
            assert.equal(msg, "Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
        });
        it('Preklapanje potpuno', function(){
            let div = document.createElement("div");
            let body = document.querySelector("body");
            let list = body.getElementsByTagName("div");
            let testDiv = list[list.length-1];
            body.insertBefore(div, testDiv);
            Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 21);
            Raspored.dodajAktivnost(div, "WT", "predavanje", 8, 10, "Ponedjeljak");
            let msg = Raspored.dodajAktivnost(div, "WT", "vježbe", 8, 10, "Ponedjeljak");
            assert.equal(msg, "Greška - već postoji termin u rasporedu u zadanom vremenu");
        });
        it('Preklapanje djelimično', function(){
            let div = document.createElement("div");
            let body = document.querySelector("body");
            let list = body.getElementsByTagName("div");
            let testDiv = list[list.length-1];
            body.insertBefore(div, testDiv);
            Raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 21);
            Raspored.dodajAktivnost(div, "WT", "predavanje", 10, 12, "Ponedjeljak");
            let msg = Raspored.dodajAktivnost(div, "WT", "vježbe", 9, 11, "Ponedjeljak");
            assert.equal(msg, "Greška - već postoji termin u rasporedu u zadanom vremenu");
        });
    });
});