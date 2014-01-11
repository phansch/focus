function init() {
  focusApp.indexedDB.open();
  focusApp.updateTime();
}

window.addEventListener("DOMContentLoaded", init, false);

$("#todo").keyup(function() {
  focusApp.indexedDB.updateTask($("#todo").val());
});

