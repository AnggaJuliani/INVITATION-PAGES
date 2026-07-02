function showScanSuccess(guestName) {
  const now = new Date();

  const timeString = now.toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "medium"
  });

  document.getElementById("guestName").innerText = guestName;
  document.getElementById("checkinTime").innerText = timeString;

  document.getElementById("scanModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("scanModal").classList.add("hidden");
}

function vibrateSuccess(){
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200]); 
    // getar - jeda - getar (efek "notifikasi sukses")
  }
}
