var Raspored=(function(){
    const moguciSati=[0,2,4,6,8,10,12,15,17,19,21,23];
    function iscrtajRaspored(div, dani, satPocetak, satKraj){
        if(satPocetak % 1 != 0 || satPocetak < 0 || satPocetak > 24 || satKraj % 1 != 0 || satKraj < 0 || satKraj > 24 || satPocetak >= satKraj){
            var greska = document.createElement("p");
            greska.innerText = "Greška"
            div.append(greska);
        }else{
            var table = document.createElement("table");
            div.append(table);
            var topRow = document.createElement("tr");
            topRow.append(document.createElement("th"));
            table.append(topRow);
            dani.forEach(element => {
                var row = document.createElement("tr");
                var dan = document.createElement("th");
                dan.innerText = element;
                dan.classList.add("Dani");
                row.append(dan);
                table.append(row);
            });
            for(var i = satPocetak; i < satKraj; i++){
                var sat = document.createElement("th");
                sat.colSpan = 2;
                sat.classList.add("Sati");
                topRow.append(sat);
                if(moguciSati.includes(i)){
                    sat.innerText = i + ":00";
                }
                table.childNodes.forEach(element =>{
                    if(element != topRow){
                        for(var j = 0; j < 2; j++){
                            var polje = document.createElement("td");
                            if(j == 0){
                                polje.style.borderRight = "0.5px dashed";
                            }
                            else{
                                polje.style.borderLeft = "0.5px dashed";
                            }
                            element.append(polje);
                        }
                    }
                });
            }
        }
    }
    
    function dodajAktivnost(raspored, naziv, tip, vrijemePocetak, vrijemeKraj, dan){
        if(raspored == null || raspored.firstChild.nodeName != "TABLE"){
            return "Greška - raspored nije kreiran";
        }
        var table = raspored.firstChild;
        var topRow = table.firstChild;
        var pocetniSat = -1;
        var krajSat = -1;
        var polja = 0;
        var poljaDoPrvog = 0;
        for(var i = 1; i < topRow.childNodes.length; i++){
            if(topRow.childNodes[i].innerText != "" && pocetniSat == -1){
                pocetniSat = topRow.childNodes[i].innerText;
                poljaDoPrvog = polja;
            }
            polja++;
        }
        pocetniSat = parseInt(pocetniSat.substring(0, pocetniSat.length-3));
        pocetniSat -= poljaDoPrvog;
        krajSat = pocetniSat + polja;
    
        var red = 0;
        for(var i = 0; i < table.rows.length; i++){
            if(table.rows[i].firstChild.innerText == dan){
                red = table.rows[i];
                break;
            }
        }
        if(vrijemePocetak < pocetniSat || vrijemeKraj > krajSat || (vrijemePocetak % 1 != 0 && vrijemePocetak % 1 != 0.5) || 
        (vrijemeKraj % 1 != 0 && vrijemeKraj % 1 != 0.5) || red == 0){
            return "Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin";
        }
    
        var duzina = (vrijemeKraj - vrijemePocetak)/0.5;
        var pocetakTermina = (vrijemePocetak-pocetniSat)/0.5;
        var lokacijaBrisanja = 1;
        var indexPretrage = pocetakTermina;
        while(indexPretrage > 0){
            indexPretrage -= red.cells[lokacijaBrisanja].colSpan;
            lokacijaBrisanja++;
        }
        for(var i = lokacijaBrisanja; i < lokacijaBrisanja + duzina; i++){
            if(red.cells[i].childNodes.length > 0){
                return "Greška - već postoji termin u rasporedu u zadanom vremenu";
            }
        }
    
        for(var i = pocetakTermina; i < pocetakTermina + duzina; i++){
            red.deleteCell(lokacijaBrisanja);
        }
        var noviTermin = red.insertCell(lokacijaBrisanja);
        noviTermin.colSpan = duzina;
        if(vrijemePocetak%1 != 0){
            noviTermin.style.borderLeft = "0.5px dashed";
        }
        if(vrijemeKraj%1 != 0){
            noviTermin.style.borderRight = "0.5px dashed";
        }
        noviTermin.classList.add("Termin");
        var nazivText = document.createElement("h1");
        nazivText.innerHTML = naziv;
        var tipText = document.createElement("h2");
        tipText.innerHTML = tip;
        noviTermin.append(nazivText);
        noviTermin.append(tipText);
    }

    return{
        iscrtajRaspored: iscrtajRaspored,
        dodajAktivnost: dodajAktivnost
    }
    
}());



