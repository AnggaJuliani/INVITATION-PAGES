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
