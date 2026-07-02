let comments = [];
let visible = 4;

function initials(name){

    return name
        .split(" ")
        .map(v=>v[0])
        .join("")
        .substring(0,2)
        .toUpperCase();

}

function relativeTime(date){

    const now = new Date();

    const then = new Date(date);

    const sec = Math.floor((now-then)/1000);

    if(sec<60) return "Baru saja";

    const min=Math.floor(sec/60);

    if(min<60)
        return min+" menit yang lalu";

    const hour=Math.floor(min/60);

    if(hour<24)
        return hour+" jam yang lalu";

    const day=Math.floor(hour/24);

    if(day==1)
        return "Kemarin";

    if(day<7)
        return day+" hari yang lalu";

    const week=Math.floor(day/7);

    return week+" minggu yang lalu";

}

async function loadComments(){

    document.getElementById("commentsLoading").style.display="block";

    const res = await fetch(
        API_URL+"?action=comments"
    );

    comments = await res.json();

    document.getElementById("commentsLoading").style.display="none";

    document.getElementById("commentCounter").innerHTML=
        "❤️ "+comments.length+" Ucapan";

    renderComments();

}

function renderComments(){

    const container=document.getElementById("comments");

    container.innerHTML="";

    comments
        .slice(0,visible)
        .forEach(item=>{

            container.innerHTML += `

<div class="comment">

    <div class="comment-avatar">
        ${initials(item.name)}
    </div>

    <div class="comment-body">

        <div class="comment-header">

            <div class="comment-name">
                ${item.name}
            </div>

            <div class="comment-time">
                ${relativeTime(item.date)}
            </div>

        </div>

        <div class="comment-message">
            ${item.message}
        </div>

    </div>

</div>

`;
        });

    document.getElementById("loadMoreBtn").style.display=
        visible>=comments.length?"none":"inline-block";

}

document
.getElementById("loadMoreBtn")
.onclick=()=>{

    visible+=4;

    renderComments();

};

async function sendRSVP(){

    const name=document.getElementById("rsvpName").value.trim();

    const message=document.getElementById("rsvpMessage").value.trim();

    if(!name||!message){

        alert("Lengkapi data.");

        return;

    }

    const btn=document.getElementById("sendRSVP");

    btn.disabled=true;

    btn.innerHTML="Mengirim...";

    await fetch(API_URL,{

    method:"POST",

    body:JSON.stringify({

        action:"rsvp",

        name,

        message

    })
    });

    document.getElementById("rsvpMessage").value="";

    btn.disabled=false;

    btn.innerHTML="Kirim Ucapan";

    visible=4;

    await loadComments();

    window.scrollTo({

        top:document.getElementById("comments").offsetTop-80,

        behavior:"smooth"

    });

}

document
.getElementById("sendRSVP")
.addEventListener("click",sendRSVP);

loadComments();
