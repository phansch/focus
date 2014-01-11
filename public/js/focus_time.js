focusApp.updateTime = function() {
  time = document.getElementById("time");

  function getTime() {
    var now = new Date(Date.now());
    var hours = now.getHours();
    var minutes = now.getMinutes();
    return hours + ":" + minutes;
  }

  function setTime() {
    time.innerHTML = getTime();
  }

  setTime();

  setInterval(function() {
    setTime();
  }, 1000 * 60);
};
