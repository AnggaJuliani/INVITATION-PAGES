const SHEET_URL =
"https://docs.google.com/spreadsheets/d/15whtvCxRslZhsBm3e30FCZGo9oHtkE2S5i93qk9B-80/edit";

document.addEventListener("DOMContentLoaded",()=>{

initExport();

});

function initExport(){

const open=document.getElementById("btnOpenSheet");

if(open){

open.onclick=()=>{

window.open(SHEET_URL,"_blank");

};

}

const guest=document.getElementById("btnGuestExcel");

if(guest){

guest.onclick=exportGuestExcel;

}

const rsvp=document.getElementById("btnRSVPExcel");

if(rsvp){

rsvp.onclick=exportRSVPExcel;

}

}

async function exportGuestExcel(){

showLoading("Menyiapkan Excel...");

try{

const res=await fetch(API_URL+"?action=getGuests");

const guests=await res.json();

const workbook=new ExcelJS.Workbook();

const sheet=workbook.addWorksheet("Guests");

sheet.columns=[

{header:"No",key:"no",width:10},

{header:"Nama",key:"name",width:35},

{header:"Link",key:"link",width:40},

{header:"QR Code",key:"qr",width:20},

{header:"Status",key:"status",width:18},

{header:"Check In",key:"time",width:25}

];

guests.forEach((g,i)=>{

sheet.addRow({

no:i+1,

name:g.name,

link:
"https://anggajuliani.github.io/INVITATION-PAGES/?to="+g.link,

qr:g.qr,

status:g.status,

time:g.time

});

});

sheet.getRow(1).font={bold:true};

const buffer=
await workbook.xlsx.writeBuffer();

saveAs(

new Blob([buffer]),

"Guest_List.xlsx"

);

showToast("Guest Excel berhasil dibuat");

}

catch(e){

console.log(e);

showToast(

"Gagal export",

"#e74c3c"

);

}

hideLoading();

}

async function exportRSVPExcel(){

showLoading("Menyiapkan Excel...");

try{

const res=
await fetch(API_URL+"?action=getRSVP");

const rows=
await res.json();

const workbook=
new ExcelJS.Workbook();

const sheet=
workbook.addWorksheet("RSVP");

sheet.columns=[

{header:"No",key:"no",width:10},

{header:"Nama",key:"name",width:35},

{header:"Ucapan",key:"message",width:70},

{header:"Tanggal",key:"date",width:25}

];

rows.forEach((r,i)=>{

sheet.addRow({

no:i+1,

name:r.name,

message:r.message,

date:r.date

});

});

sheet.getRow(1).font={bold:true};

const buffer=
await workbook.xlsx.writeBuffer();

saveAs(

new Blob([buffer]),

"RSVP_List.xlsx"

);

showToast("RSVP Excel berhasil dibuat");

}

catch(e){

console.log(e);

showToast(

"Gagal export",

"#e74c3c"

);

}

hideLoading();

}

