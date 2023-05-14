
let okvir=document.getElementById("okvir");
iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
dodajAktivnost(okvir,"WT","predavanje",9,12,"Ponedjeljak");
dodajAktivnost(okvir,"WT","vježbe",12,13.5,"Ponedjeljak");
dodajAktivnost(okvir,"RMA","predavanje",14,17,"Ponedjeljak");
dodajAktivnost(okvir,"RMA","vježbe",12.5,14,"Utorak");
dodajAktivnost(okvir,"DM","tutorijal",14,16,"Utorak");
dodajAktivnost(okvir,"DM","predavanje",16,19,"Utorak");
dodajAktivnost(okvir,"OI","predavanje",12,15,"Srijeda");
dodajAktivnost(okvir,"OIS","tutorijal",19,20.5,"Srijeda");
dodajAktivnost(okvir,"OIS","predavanje",9.5,11.5,"Petak");
dodajAktivnost(okvir,"RG","tutorijal",11.5,13,"Petak");

//Greška dan ne postoji
dodajAktivnost(okvir,"WT","predavanje",9,12,"Test");

let okvir2=document.getElementById("okvir2");
iscrtajRaspored(okvir2,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak", "Subota"],0,23);
dodajAktivnost(okvir2,"OIS","predavanje",17,20,"Ponedjeljak");
dodajAktivnost(okvir2,"OIS","vježbe",15.5,17,"Ponedjeljak");
dodajAktivnost(okvir2,"RMA","vjezbe",21.5,23,"Ponedjeljak");
dodajAktivnost(okvir2,"DM","tutorijal",2,3.5,"Utorak");
dodajAktivnost(okvir2,"OI","predavanje",9,15,"Utorak");
dodajAktivnost(okvir2,"DM","predavanje",16,19,"Četvrtak");
dodajAktivnost(okvir2,"RMA","predavanje",12,15,"Srijeda");
dodajAktivnost(okvir2,"WT","tutorijal",19,20.5,"Srijeda");
dodajAktivnost(okvir2,"WT","predavanje",7,10,"Četvrtak");
dodajAktivnost(okvir2,"RG","tutorijal",11.5,13,"Subota");

//Greška preklapanje
dodajAktivnost(okvir2,"OI","tutorijal",9,12,"Subota");

//Greška negativno vrijeme
let greska1=document.getElementById("greska1");
iscrtajRaspored(greska1,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],-4,20);

//Greška raspored nije kreiran
dodajAktivnost(greska1,"OIS","predavanje",17,20,"Ponedjeljak");

//Greška vrijeme nije cijeli broj
let greska2=document.getElementById("greska2");
iscrtajRaspored(greska2,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],5.5,20);

