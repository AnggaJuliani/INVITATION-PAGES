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

    await loadDashboard();

    await loadGuests();

    hideLoading();

}

/* ==========================================================
   Loading
========================================================== */

function hideLoading(){

    const loading = document.getElementById("loading");

    if(!loading) return;

    setTimeout(()=>{

        loading.style.opacity="0";

        setTimeout(()=>{

            loading.style.display="none";

        },300);

    },500);

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

            case "comment":

                title.innerHTML="Ucapan";

                if(typeof loadComments==="function"){

                    loadComments();

                }

            break;

            case "export":

                title.innerHTML="Export";

            break;

            case "setting":

                title.innerHTML="Pengaturan";

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

        const data =
            await res.json();

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

    const tbody =
        document.getElementById("guestTable");

    if(!tbody) return;

    tbody.innerHTML = "";

    if(data.length===0){

        tbody.innerHTML = `
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

<td>

${index+1}

</td>

<td>

${guest.name}

</td>

<td>

${guest.link}

</td>

<td>

${guest.qr}

</td>

<td>

<span class="${
guest.status==="Sudah Hadir"
?"status-success"
:"status-wait"
}">

${guest.status}

</span>

</td>

<td>

${guest.time || "-"}

</td>

<td>

<button
class="edit-btn"
data-id="${guest.id}">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="delete-btn"
data-id="${guest.id}">

<i class="fa-solid fa-trash"></i>

</button>

<button
class="reset-btn"
data-id="${guest.id}">

<i class="fa-solid fa-rotate-left"></i>

</button>

</td>

</tr>

`;

    });

}

/* ==========================================================
   REFRESH
========================================================== */

const refreshBtn =
document.getElementById("refreshGuest");

if(refreshBtn){

    refreshBtn.onclick=()=>{

        loadGuests();

    };

}

/* ==========================================================
   EDIT GUEST
========================================================== */

async function editGuest(id){

    try{

        const res = await fetch(
            API_URL + "?action=getGuestById&id=" + id
        );

        const data = await res.json();

        if(!data.status){

            alert(data.message);

            return;

        }

        const g = data.guest;

        document.getElementById("editId").value = g.id;
        document.getElementById("editName").value = g.name;
        document.getElementById("editLink").value = g.link;
        document.getElementById("editQR").value = g.qr;

        document
            .getElementById("editModal")
            .classList.add("show");

    }

    catch(err){

        console.log(err);

        alert("Gagal mengambil data.");

    }

}

/* ==========================================================
   CLOSE MODAL
========================================================== */

document
.getElementById("btnCloseEdit")
.onclick = ()=>{

    document
        .getElementById("editModal")
        .classList.remove("show");

};

/* ==========================================================
   SAVE EDIT
========================================================== */

document
.getElementById("btnSaveEdit")
.onclick = async ()=>{

    const body={

        action:"updateGuest",

        id:document.getElementById("editId").value,

        name:document.getElementById("editName").value,

        link:document.getElementById("editLink").value,

        qr:document.getElementById("editQR").value

    };

    const res=await fetch(API_URL,{

        method:"POST",

        body:JSON.stringify(body)

    });

    const result=await res.json();

    alert(result.message);

    document
        .getElementById("editModal")
        .classList.remove("show");

    loadGuests();

};

/* ==========================================================
   DELETE GUEST
========================================================== */

async function deleteGuest(id){

    if(!confirm("Hapus tamu ini?")) return;

    const res = await fetch(API_URL,{

        method:"POST",

        body:JSON.stringify({

            action:"deleteGuest",

            id:id

        })

    });

    const data = await res.json();

    alert(data.message);

    loadGuests();

}

/* ==========================================================
   RESET CHECK IN
========================================================== */

async function resetCheckin(id){

    if(!confirm("Reset status check in?"))

        return;

    const res = await fetch(API_URL,{

        method:"POST",

        body:JSON.stringify({

            action:"resetCheckin",

            id:id

        })

    });

    const data = await res.json();

    if(data.status){

        loadGuests();

    }

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

            const text = row.innerText.toLowerCase();

            row.style.display =
                text.includes(keyword)
                ? ""
                : "none";

        });

    });

}

/* ==========================================================
   LOADING SCREEN
========================================================== */

window.addEventListener("load",()=>{

    setTimeout(()=>{

        document
        .getElementById("loading")
        .style.display="none";

    },500);

});

