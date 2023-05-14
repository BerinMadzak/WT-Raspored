let textArea = document.getElementById("textArea");
let select = document.getElementById("select");
let p = document.getElementById("test");
let jsonList = [];
loadSelect();

function loadSelect()
{
    let xhttp = new XMLHttpRequest();  
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let json = JSON.parse(this.response);
            json.forEach(el =>{
                let option = document.createElement("option");
                option.innerHTML = el['naziv'];
                select.appendChild(option);
                jsonList.push(el);
            });
        }
    }
    xhttp.open("GET","http://localhost:3000/v2/grupe/",true);
    xhttp.send();
}

function submit()
{
    let json = [];
    let linije = textArea.value.split('\n');
    linije.forEach(linija =>{
        let objekat = {};
        params = linija.split(',');
        objekat['ime'] = params[0];
        objekat['index'] = params[1];
        let grupa = select.value;
        objekat['grupa'] = grupa;
        json.push(objekat);
    });
    let xhttp = new XMLHttpRequest();  
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            textArea.value = this.response;
        }
    }
    xhttp.open("POST","http://localhost:3000/v2/studentLista",true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(json));
}