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

                title.innerHTML="Cari Tamu";

            break;

            case "rsvp":

                title.innerHTML="RSVP";

                if(typeof loadRSVP==="function"){

                    loadRSVP();

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

            <td>${guest.link}</td>

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
                    title="Delete">

                    <i class="fa-solid fa-trash"></i>

                </button>

                <button
                    class="reset-btn"
                    data-id="${guest.id}"
                    title="Reset">

                    <i class="fa-solid fa-rotate-left"></i>

                </button>

            </td>

        </tr>
        `;

    });

    

}

document.addEventListener("click",(e)=>{


    const del=e.target.closest(".delete-btn");

    if(del){

        deleteGuest(del.dataset.id);

        return;

    }

    const reset=e.target.closest(".reset-btn");

    if(reset){

        resetCheckin(reset.dataset.id);

    }

});
/* ==========================================================
   REFRESH
========================================================== */

const refreshBtn = document.getElementById("refreshGuest");
refreshBtn.onclick = ()=>{

    withLoading(async()=>{

        await loadGuests();

        await loadDashboard();

    },"Memuat Data...");

};


/* ==========================================================
   DELETE GUEST
========================================================== */

async function deleteGuest(id){

    const ok = await showConfirm(

        "Hapus Data Tamu",
        "Data tamu yang dihapus tidak dapat dikembalikan."

    );

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

            showToast(data.message,"#e74c3c");

        }

    },"Menghapus Data...");

}
/* ==========================================================
   RESET CHECK IN
========================================================== */

async function resetCheckin(id){

    const ok = await showConfirm(

        "Reset Check In",
        "Status check in akan dikembalikan menjadi Belum Hadir."

    );

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

function showConfirm(title,message){

    return new Promise(resolve=>{

        const modal=document.getElementById("confirmModal");

        modal.querySelector(".confirm-title").innerHTML=title;

        modal.querySelector(".confirm-message").innerHTML=message;

        modal.classList.add("show");

        modal.querySelector(".btn-ok").onclick=()=>{

            modal.classList.remove("show");

            resolve(true);

        };

        modal.querySelector(".btn-cancel").onclick=()=>{

            modal.classList.remove("show");

            resolve(false);

        };

    });

}

