focusApp.updateTime = function() {
  time = document.getElementById("time");

  function getTime() {
    var now = new Date(Date.now());
    var hours = now.getHours();
    var minutes = now.getMinutes();
    if(minutes < 10) {
      minutes = "0" + minutes;
    }
    if(hours < 10) {
      hours = "0" + hours;
    }
    return hours + ":" + minutes;
  }

  function setTime() {
    time.innerHTML = getTime();
  }

  setTime();

  setInterval(function() {
    setTime();
  }, 1000);
};
