/* ==========================================================
   Wedding Admin Dashboard
   admin.js
   PART 1
========================================================== */

const API_URL =
"https://script.google.com/macros/s/AKfycbwfz-rbBxKY-uPOkTvTCl7lLLIemCh-_eqSfP4oXADE18s1CpjfpPqbeTZX6rJk5Pjwag/exec";

/*
GANTI URL DI ATAS
dengan URL Web Apps milik Anda
*/

document.addEventListener("DOMContentLoaded", () => {

    initDashboard();

});

async function initDashboard(){

    initSidebar();

    initQuickAction();
initGuestButtons();
   initAddGuest();
   initImportExcel();

    try{

        await withLoading(async()=>{

            await Promise.all([

                loadDashboard(),
                loadGuests()

            ]);

        },"Memuat Dashboard...");

    }

    catch(e){

        console.error(e);

    }

}
/* ==========================================================
   Loading
========================================================== */

function showLoading(text="Memproses..."){

    const loading=document.getElementById("loading");

    if(!loading) return;

    const txt=loading.querySelector(".loading-text");

    if(txt){

        txt.innerHTML=text;

    }

    loading.classList.add("show");

}

function hideLoading(){

    const loading=document.getElementById("loading");

    if(!loading) return;

    loading.classList.remove("show");

}

async function withLoading(callback, text="Memproses..."){

    showLoading(text);

    try{

        return await callback();

    }

    finally{

        hideLoading();

    }

}
/* ==========================================================
   Sidebar
========================================================== */

function initSidebar(){

    const menuBtn =
        document.getElementById("menuBtn");

    const sidebar =
        document.querySelector(".sidebar");

    if(menuBtn){

        menuBtn.onclick=()=>{

            sidebar.classList.toggle("active");

        };

    }

    const menus =
        document.querySelectorAll(".menu li");

    menus.forEach(menu=>{

        menu.onclick=()=>{

            if(menu.dataset.link){

                location.href=menu.dataset.link;

                return;

            }

            menus.forEach(m=>m.classList.remove("active"));

            menu.classList.add("active");

            showPage(menu.dataset.page);

        };

    });

}

/* ==========================================================
   Quick Action
========================================================== */

function initQuickAction(){

    document
    .querySelectorAll(".quick-card")
    .forEach(card=>{

        card.onclick=()=>{

            if(card.dataset.link){

                location.href=
                card.dataset.link;

                return;

            }

            if(card.dataset.page){

                showPage(card.dataset.page);

            }

        };

    });

}

/* ==========================================================
   Show Page
========================================================== */

function showPage(page){

    document
    .querySelectorAll(".page")
    .forEach(p=>{

        p.classList.remove("active");

    });

    const target =
    document.getElementById(page+"Page");

    if(target){

        target.classList.add("active");

    }

    const title =
    document.querySelector(".title");

    if(title){

        switch(page){

            case "dashboard":

                title.innerHTML="Dashboard";

            break;

            case "guest":

                title.innerHTML="Data Tamu";

                if(typeof loadGuests==="function"){

                    loadGuests();

                }

            break;

            case "add":

                title.innerHTML="Tambah Tamu";

            break;

            case "search":

    title.innerHTML = "Cari Tamu";

    if(guestData.length){

        renderSearchList(guestData);

    }

break;

              case "import":

    title.innerHTML = "Import Excel";

break;

            case "rsvp":

    title.innerHTML = "RSVP";

    if(typeof loadComments === "function"){

        loadComments();

    }

break;

            case "export":

                title.innerHTML="Export";

            break;


        }

    }

}

/* ==========================================================
   Dashboard
========================================================== */

async function loadDashboard(){

    try{

        const res =
        await fetch(

            API_URL+
            "?action=dashboard"

        );

        const data =
        await res.json();

        if(!data.status){

            return;

        }

        document.getElementById("totalGuest")
        .innerHTML=data.totalGuest;

        document.getElementById("totalPresent")
        .innerHTML=data.totalPresent;

        document.getElementById("totalAbsent")
        .innerHTML=data.totalAbsent;

        document.getElementById("totalRSVP")
        .innerHTML=data.totalRSVP;

    }

    catch(err){

        console.error(err);

    }

}

/* ==========================================================
   Refresh Dashboard
========================================================== */

async function refreshDashboard(){

    await loadDashboard();

}

/* ==========================================================
   PART 2A
   LOAD DATA TAMU
========================================================== */

let guestData = [];
let excelData = [];
let importData = [];
let duplicateData = [];

/* ==========================================================
   LOAD GUESTS
========================================================== */

async function loadGuests(){

    try{

        const tbody =
            document.getElementById("guestTable");

        if(tbody){

            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center">
                        Memuat data...
                    </td>
                </tr>
            `;

        }

        const res =
            await fetch(
                API_URL + "?action=getGuests"
            );
       if(!res.ok){

    throw new Error(
        "HTTP "+res.status
    );

}

        const data = await res.json();

if(!Array.isArray(data)){
    throw new Error("Data guest tidak valid");
}

guestData = data;

renderGuestTable(data);

    }
    catch(err){

        console.error(err);

        document.getElementById("guestTable").innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;color:red">
                    Gagal mengambil data
                </td>
            </tr>
        `;

    }

}

/* ==========================================================
   RENDER TABLE
========================================================== */

function renderGuestTable(data){

    const tbody = document.getElementById("guestTable");

    if(!tbody) return;

    tbody.innerHTML="";

    if(data.length===0){

        tbody.innerHTML=`
        <tr>
            <td colspan="7" style="text-align:center">
                Belum ada data tamu
            </td>
        </tr>
        `;

        return;
    }

    data.forEach((guest,index)=>{

        tbody.innerHTML += `
        <tr>

            <td>${index+1}</td>

            <td>${guest.name}</td>

            <td>
    <a href="https://anggajuliani.github.io/INVITATION-PAGES/?to=${guest.link}"
       target="_blank">
       https://anggajuliani.github.io/INVITATION-PAGES/?to=${guest.link}
    </a>
</td>

            <td>${guest.qr}</td>

            <td>
                <span class="${
                    guest.status==="Sudah Hadir"
                    ?"status-success"
                    :"status-wait"
                }">
                    ${guest.status}
                </span>
            </td>

            <td>${guest.time || "-"}</td>

            <td>

                <button
    class="delete-btn"
    data-id="${guest.id}"
    data-name="${guest.name}"
    title="Delete">

    <i class="fa-solid fa-trash"></i>

</button>

<button
    class="reset-btn"
    data-id="${guest.id}"
    data-name="${guest.name}"
    title="Reset">

    <i class="fa-solid fa-rotate-left"></i>

</button>

<button class="btn-copy"
onclick="copyGuestLink('${guest.link}')">

<i class="fa-solid fa-copy"></i>

</button>

<button
    class="btn-qr"
    onclick="previewQR('${guest.qr}','${guest.name}')"
    title="Preview QR">

    <i class="fa-solid fa-qrcode"></i>

</button>
           
</td>

        </tr>
        `;

    });

    

}

document.addEventListener("click",(e)=>{

    const del=e.target.closest(".delete-btn");

    if(del){

        deleteGuest(
            del.dataset.id,
            del.dataset.name
        );

        return;

    }

    const reset=e.target.closest(".reset-btn");

    if(reset){

        resetCheckin(
            reset.dataset.id,
            reset.dataset.name
        );

    }

});

/* ==========================================================
   REFRESH
========================================================== */

const refreshBtn = document.getElementById("refreshGuest");

if(refreshBtn){

    refreshBtn.onclick = ()=>{

        withLoading(async()=>{

            await loadGuests();
            await loadDashboard();

        },"Memuat Data...");

    };

}


/* ==========================================================
   DELETE GUEST
========================================================== */

async function deleteGuest(id,name){

    const ok = await showConfirm({
    type:"delete",
    guestName:name
});

    if(!ok) return;

    await withLoading(async()=>{

        const res = await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify({

                action:"deleteGuest",

                id:id

            })

        });

        const data = await res.json();

        if(data.status){

            showToast("✔ Data tamu berhasil dihapus");

            await loadGuests();

            await loadDashboard();

        }

        else{

        }

    },"Menghapus Data...");

}
/* ==========================================================
   RESET CHECK IN
========================================================== */

async function resetCheckin(id,name){

    const ok = await showConfirm({
    type:"reset",
    guestName:name
});

    if(!ok) return;

    await withLoading(async()=>{

        const res = await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify({

                action:"resetCheckin",

                id:id

            })

        });

        const data = await res.json();

        if(data.status){

            showToast("✔ Status Check In berhasil direset");

            await loadGuests();

            await loadDashboard();

        }

    },"Mereset Status...");

}
/* ==========================================================
   SEARCH DATA TAMU
========================================================== */

const searchGuest = document.getElementById("searchGuest");

if(searchGuest){

    searchGuest.addEventListener("keyup",()=>{

        const keyword = searchGuest.value.toLowerCase();

        const rows = document.querySelectorAll("#guestTable tr");

        rows.forEach(row=>{

            const text=(row.innerText||"").toLowerCase();

            row.style.display =
                text.includes(keyword)
                ? ""
                : "none";

        });

    });

}

function showToast(text,color="#27ae60"){

    const toast=document.createElement("div");

    toast.className="toast";

    toast.style.background=color;

    toast.innerHTML=text;

    document.body.appendChild(toast);

    requestAnimationFrame(()=>{

        toast.classList.add("show");

    });

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>toast.remove(),300);

    },2500);

}

function showConfirm(options){

    return new Promise(resolve=>{

        const modal=document.getElementById("confirmModal");

        const title=document.getElementById("confirmTitle");

        const subtitle=document.getElementById("confirmSubtitle");

        const guest=document.getElementById("confirmGuest");

        const btn=document.getElementById("btnConfirm");

        if(options.type==="delete"){

            title.innerHTML="🗑️ Hapus Data Tamu";

            subtitle.innerHTML="Data berikut akan dihapus secara permanen.";

            btn.innerHTML="Hapus";

            btn.className="confirm-btn delete";

        }

        else{

            title.innerHTML="🔄 Reset Check In";

            subtitle.innerHTML="Status check in akan dikembalikan menjadi Belum Hadir.";

            btn.innerHTML="Reset";

            btn.className="confirm-btn reset";

        }

        guest.innerHTML=options.guestName;

        modal.classList.add("show");

        document.getElementById("btnCancel").onclick=()=>{

            modal.classList.remove("show");

            resolve(false);

        };

        btn.onclick=()=>{

            modal.classList.remove("show");

            resolve(true);

        };

    });

}

function copyGuestLink(slug){

    const fullLink =
        "https://anggajuliani.github.io/INVITATION-PAGES/?to=" +
        slug;

    navigator.clipboard.writeText(fullLink).then(()=>{

        showToast("Link berhasil disalin");

    }).catch(()=>{

        showToast("Gagal menyalin link");

    });

}

function previewQR(code,name){

    document.getElementById("previewQR").src =
        "https://quickchart.io/qr?size=350&text=" +
        encodeURIComponent(code);

    document.getElementById("previewGuest").innerHTML =
        name + "<br>" + code;

    document
        .getElementById("qrToast")
        .classList.add("show");

}

function closeQRToast(){

    document
        .getElementById("qrToast")
        .classList.remove("show");

}


const qrToast = document.getElementById("qrToast");

if(qrToast){

    qrToast.addEventListener("click",(e)=>{

        if(e.target===qrToast){

            closeQRToast();

        }

    });

}


function initAddGuest(){

    const btn=document.getElementById("btnAddGuest");

    if(!btn) return;

    btn.addEventListener("click",addGuest);

}

async function addGuest(){

    const name=document
        .getElementById("guestName")
        .value
        .trim();

    if(!name){

        showToast("Masukkan nama tamu.");

        return;

    }

    const btn=document.getElementById("btnAddGuest");

    btn.disabled=true;

    btn.innerHTML="Menambahkan...";

    try{

        const res=await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify({

                action:"addGuest",

                name:name

            })

        });

        const data=await res.json();

        if(data.status){

            showToast("Tamu berhasil ditambahkan");

            document.getElementById("guestName").value="";

            await loadGuests();

            await loadDashboard();

        }else{

            alert(data.message);

        }

    }catch(err){

        console.error(err);

        alert("Gagal menambahkan tamu.");

    }

    btn.disabled=false;

    btn.innerHTML="Tambah Tamu";

}

/* ==========================================================
   DATA TAMU BUTTON
========================================================== */

function initGuestButtons(){

    const addBtn=document.querySelector(".add-btn");

    if(addBtn){

        addBtn.addEventListener("click",()=>{

            // Pindah ke halaman Tambah Tamu
            showPage("add");

            // Sinkronkan menu sidebar
            document
                .querySelectorAll(".menu li")
                .forEach(li=>li.classList.remove("active"));

            const menu=document.querySelector(
                '.menu li[data-page="add"]'
            );

            if(menu){

                menu.classList.add("active");

            }

        });

    }

}

const searchInput =
document.getElementById("searchGuestInput");

const searchList =
document.getElementById("guestSearchList");

if(searchInput){

    searchInput.addEventListener(
        "input",
        renderGuestSearch
    );

}

function renderGuestSearch(){

const keyword=searchInput.value.toLowerCase().trim();

const list = guestData.filter(g=>{
    return (g.name || "")
    .toLowerCase()
    .includes(keyword);
});

renderSearchList(list);

}

function renderSearchList(list){

    if(list.length === 0){

        searchList.innerHTML = `
            <div style="padding:40px;text-align:center;color:#999;">
                Tidak ada tamu ditemukan
            </div>
        `;
        return;
    }

    searchList.innerHTML = list.map((g,index)=>`
        <div class="guest-search-item" data-index="${index}">
            <div class="guest-left">
                <div class="guest-avatar">
                    <i class="fa-solid fa-user"></i>
                </div>

                <div>
                    <div><strong>${g.name}</strong></div>
                    <div class="guest-link">
https://anggajuliani.github.io/INVITATION-PAGES/?to=${g.link}
</div>
                </div>
            </div>

            <i class="fa-solid fa-chevron-right"></i>
        </div>
    `).join("");

    document.querySelectorAll(".guest-search-item")
    .forEach((item,index)=>{

        item.addEventListener("click",()=>{

            openGuestDetail(list[index]);

        });

    });

}

function openGuestDetail(g){

const modal = document.getElementById("guestDetailModal");

if(!modal) return;

modal.style.display="flex";

document.getElementById("detailGuestName").innerHTML=g.name;

document.getElementById("detailGuestQR").src =
"https://quickchart.io/qr?size=300&text=" +
encodeURIComponent(g.qr);

document.getElementById("detailGuestLink").value =
"https://anggajuliani.github.io/INVITATION-PAGES/?to=" +
g.link;

document.getElementById("copyGuestLinkBtn").onclick=()=>{

navigator.clipboard.writeText(

"https://anggajuliani.github.io/INVITATION-PAGES/?to=" +
g.link

);

showToast("Link berhasil disalin");

};

document.getElementById("openGuestBtn").onclick = () => {

    window.open(
        "https://anggajuliani.github.io/INVITATION-PAGES/?to=" + g.link,
        "_blank"
    );

};
const closeBtn =
document.getElementById("closeGuestModal");

if(closeBtn){

    closeBtn.onclick=()=>{

        document
        .getElementById("guestDetailModal")
        .style.display="none";

    };

}

};

window.onclick=e=>{

if(e.target.id=="guestDetailModal")

document.getElementById("guestDetailModal").style.display="none";

};

let commentData = [];

async function loadComments(){

    const res = await fetch(API_URL + "?action=adminComments");

    commentData = await res.json();

    renderComments(commentData);

}

function renderComments(data){

    const list = document.getElementById("commentList");

    if(data.length===0){

        list.innerHTML=`
        <div class="placeholder">
            Belum ada ucapan.
        </div>
        `;

        return;

    }

    list.innerHTML="";

    data.forEach(item=>{

        list.innerHTML+=`

        <div class="comment-card">

            <div class="comment-header">

                <div class="comment-name">
                    👤 ${item.name}
                </div>

                <div class="comment-date">
                    🕒 ${item.date}
                </div>

            </div>

            <div class="comment-message">

                ${item.message}

            </div>

        </div>

        `;

    });

}

const searchComment = document.getElementById("searchComment");

if(searchComment){

    searchComment.addEventListener("input",()=>{

        const keyword = searchComment.value
            .toLowerCase()
            .trim();

        const result = commentData.filter(item=>{

            return (
                item.name.toLowerCase().includes(keyword) ||
                item.message.toLowerCase().includes(keyword)
            );

        });

        renderComments(result);

    });

}


