/* ==========================================================
   IMPORT EXCEL
   PART 1
========================================================== */

let excelRows = [];
let importRows = [];
let duplicateRows = [];

function initImport(){

    const btn=document.getElementById("btnPreview");

    if(btn){

        btn.onclick=previewExcel;

    }

    const choose=document.getElementById("btnChooseExcel");

    const input=document.getElementById("excelFile");

    if(choose && input){

        choose.onclick=()=>input.click();

    }

    input.onchange=showSelectedFile;

}

function showSelectedFile(){

    const input=document.getElementById("excelFile");

    const info=document.getElementById("selectedFile");

    if(!input.files.length){

        info.innerHTML="Belum ada file dipilih";

        return;

    }

    const file=input.files[0];

    info.innerHTML=`
        <i class="fa-solid fa-file-excel"></i>

        <strong>${file.name}</strong>

        (${(file.size/1024).toFixed(1)} KB)
    `;

}

/* ==========================================================
   PREVIEW EXCEL
========================================================== */

function previewExcel(){

    const input = document.getElementById("excelFile");

    if(!input){

        showToast("Input file tidak ditemukan.","#e74c3c");

        return;

    }

    if(input.files.length===0){

        showToast("Silakan pilih file Excel.","#e74c3c");

        return;

    }

    const file = input.files[0];

if(!/\.(xlsx|xls)$/i.test(file.name)){
    showToast("File harus Excel (.xlsx / .xls)","#e74c3c");
    return;
}

showLoading("Membaca File Excel...");

const reader=new FileReader();

reader.onload=function(e){

    try{

        readWorkbook(e.target.result);

    }catch(err){

        hideLoading();
        console.error(err);
        showToast("Format Excel tidak valid","#e74c3c");

    }

};

reader.readAsArrayBuffer(file);
}
/* ==========================================================
   READ WORKBOOK
========================================================== */

function readWorkbook(buffer){

    const workbook = XLSX.read(buffer,{

        type:"array"

    });

    if(workbook.SheetNames.length===0){

        hideLoading();

        showToast("Sheet kosong","#e74c3c");

        return;

    }

    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet,{

        header:1

    });

    processExcel(rows);

}

/* ==========================================================
   PROCESS EXCEL
========================================================== */

function processExcel(rows){

    excelRows = [];
    importRows = [];
    duplicateRows = [];

    const excelNames = new Set();

    if(rows.length===0){

        hideLoading();
        showToast("Excel kosong","#e74c3c");
        return;

    }

    rows.forEach((row,index)=>{

        if(index===0) return;
        if(!row) return;

        const name = String(row[0] || "").trim();

        if(name==="") return;

        const key = normalizeName(name);

        const already = excelNames.has(key);

        excelNames.add(key);

        const duplicate =
            already ||
            guestData.some(g =>
                normalizeName(g.name) === key
            );

        const item = {

            no:index,

            name:name,

            duplicate:duplicate

        };

        excelRows.push(item);

        if(duplicate){

            duplicateRows.push(item);

        }else{

            importRows.push(item);

        }

    });

    updateImportSummary();

    hideLoading();

}
/* ==========================================================
   NORMALIZE
========================================================== */

function normalizeName(name){

    return String(name)

    .trim()

    .toLowerCase()

    .replace(/\s+/g," ")

    .normalize("NFD")

    .replace(/[\u0300-\u036f]/g,"");

}

/* ==========================================================
   SUMMARY
========================================================== */

function updateImportSummary(){

    const div = document.getElementById("importSummary");

    if(!div) return;

    div.innerHTML=`

        <div class="summary-card">

            <div class="summary-item">

                <h2>${excelRows.length}</h2>

                <span>Total Excel</span>

            </div>

            <div class="summary-item success">

                <h2>${importRows.length}</h2>

                <span>Data Baru</span>

            </div>

            <div class="summary-item danger">

                <h2>${duplicateRows.length}</h2>

                <span>Duplikat</span>

            </div>

        </div>

    `;

    renderImportPreview();

}

/* ==========================================================
   PREVIEW PLACEHOLDER
========================================================== */

/* ==========================================================
   RENDER IMPORT PREVIEW
========================================================== */

function renderImportPreview(){

    const div=document.getElementById("importPreview");

    if(!div) return;

    if(excelRows.length===0){

        div.innerHTML=`
        <div class="placeholder">

            Tidak ada data.

        </div>
        `;

        return;

    }

    div.innerHTML=`

    <div class="import-toolbar">

        <input
            id="importSearch"
            class="import-search"
            placeholder="Cari nama...">

        <button
            class="primary-btn"
            id="btnImportExcel">

            Import ke Google Sheet

        </button>

    </div>

    <table class="import-table">

        <thead>

            <tr>

                <th>No</th>

                <th>Nama</th>

                <th>Status</th>

            </tr>

        </thead>

        <tbody id="importTableBody">

        </tbody>

    </table>

    `;

    renderImportTable(excelRows);

    initImportSearch();

    initImportButton();

}

/* ==========================================================
   RENDER TABLE
========================================================== */

function renderImportTable(data){

    const tbody=document.getElementById("importTableBody");

    if(!tbody) return;

    tbody.innerHTML="";

    data.forEach((item,index)=>{

        tbody.innerHTML+=`

        <tr>

            <td>${index+1}</td>

            <td>${item.name}</td>

            <td>

                ${
                    item.duplicate
                    ?

                    `<span class="badge-danger">

                        Duplikat

                    </span>`

                    :

                    `<span class="badge-success">

                        Baru

                    </span>`

                }

            </td>

        </tr>

        `;

    });

}

/* ==========================================================
   SEARCH
========================================================== */

function initImportSearch(){

    const input=document.getElementById("importSearch");

    if(!input) return;

    input.addEventListener("input",()=>{

        const key=input.value

        .trim()

        .toLowerCase();

        const result=excelRows.filter(x=>{

            return x.name

            .toLowerCase()

            .includes(key);

        });

        renderImportTable(result);

    });

}

/* ==========================================================
   BUTTON IMPORT
========================================================== */

function initImportButton(){

    const btn=document.getElementById("btnImportExcel");

    if(!btn) return;

    btn.onclick=confirmImport;

}

/* ==========================================================
   CONFIRM IMPORT
========================================================== */

/* ==========================================================
   CONFIRM IMPORT
========================================================== */

async function confirmImport(){

    if(importRows.length===0){

        showToast(
            "Tidak ada data yang dapat diimport.",
            "#e74c3c"
        );

        return;

    }

    const ok = await showConfirm({

        type:"import",

        total:importRows.length,

        duplicate:duplicateRows.length

    });

    if(!ok) return;

    importGuests();

}
/* ==========================================================
   IMPORT DATA KE GOOGLE SHEET
========================================================== */

async function importGuests(){

    if(importRows.length===0){

        showToast("Tidak ada data untuk diimport","#e74c3c");

        return;

    }

    try{

        showLoading("Mengimport " + importRows.length + " tamu...");

        const btn=document.getElementById("btnImportExcel");

        if(btn){

            btn.disabled=true;
            btn.innerHTML="Mengimport...";
        }

        const res = await fetch(API_URL,{

    method:"POST",

    body:JSON.stringify({

        action:"importGuests",

        guests:importRows

    })

});

       if(!res.ok){

    throw new Error("HTTP " + res.status);

}

const result = await res.json();
        hideLoading();

        if(btn){

            btn.disabled=false;
            btn.innerHTML="Import ke Google Sheet";
        }

        if(!result.status){

            showToast(result.message || "Import gagal","#e74c3c");

            return;

        }

        showToast(

            "✔ Berhasil mengimport " +

            result.total +

            " tamu."

        );

        resetImport();

        await loadGuests();

        await loadDashboard();

    }

    catch(err){

        hideLoading();

        console.error(err);

        showToast(

            "Gagal menghubungi server",

            "#e74c3c"

        );

    }

}

/* ==========================================================
   RESET IMPORT
========================================================== */

function resetImport(){

    excelRows=[];

    importRows=[];

    duplicateRows=[];

    document.getElementById("excelFile").value="";

    document.getElementById("selectedFile").innerHTML=
    "Belum ada file dipilih";

    document.getElementById("importSummary").innerHTML="";

    document.getElementById("importProgress").style.display="none";

    document.getElementById("importPreview").innerHTML=`

        <div class="placeholder">

            Silakan pilih file Excel.

        </div>

    `;

    showToast("File berhasil direset");
}


function initDropArea(){

    const box=document.getElementById("dropArea");

    const input=document.getElementById("excelFile");

    if(!box || !input) return;

    box.onclick=(e)=>{

        if(e.target.tagName!=="BUTTON"){

            input.click();

        }

    };

    box.addEventListener("dragover",(e)=>{

        e.preventDefault();

        box.classList.add("drag");

    });

    box.addEventListener("dragleave",()=>{

        box.classList.remove("drag");

    });

    box.addEventListener("drop",(e)=>{

        e.preventDefault();

        box.classList.remove("drag");

        input.files=e.dataTransfer.files;

        showSelectedFile();

    });

}

const reset=document.getElementById("btnResetImport");

if(reset){

    reset.onclick=resetImport;

}

