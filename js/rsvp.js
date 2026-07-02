async function loadComments(){

    const res = await fetch(
        API_URL + "?action=comments"
    );

    const data = await res.json();

    const container =
        document.getElementById("comments");

    container.innerHTML = "";

    data.forEach(item=>{

        container.innerHTML += `
            <div class="comment">

                <div class="comment-name">

                    ${item.name}

                </div>

                <div>

                    ${item.message}

                </div>

            </div>
        `;

    });

}

async function sendRSVP(){

    const name =
        document.getElementById("rsvpName").value.trim();

    const message =
        document.getElementById("rsvpMessage").value.trim();

    if(name=="" || message==""){

        alert("Lengkapi data.");

        return;

    }

    await fetch(API_URL,{

        method:"POST",

        body:JSON.stringify({

            action:"rsvp",

            name,

            message

        })

    });

    document.getElementById("rsvpMessage").value="";

    const toast=document.getElementById("rsvpToast");

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

    loadComments();

}

document
.getElementById("sendRSVP")
.addEventListener("click",sendRSVP);

loadComments();
