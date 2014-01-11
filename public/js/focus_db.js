var focusApp = {};

window.indexedDB = window.indexedDB || window.webkitIndexedDB ||
window.mozIndexedDB;

if ('webkitIndexedDB' in window) {
  window.IDBTransaction = window.webkitIDBTransaction;
  window.IDBKeyRange = window.webkitIDBKeyRange;
}

focusApp.indexedDB = {};
focusApp.indexedDB.db = null;

focusApp.indexedDB.onerror = function(e) {
  console.log(e);
};

focusApp.indexedDB.open = function() {
  var version = 1;
  var request = indexedDB.open("taskdb", version);

  request.onupgradeneeded = function(e) {
    var db = e.target.result;

    //A versionchange transaction is started automatically.
    e.target.transaction.onerror = focusApp.indexedDB.onerror;

    if(db.objectStoreNames.contains("task")) {
      db.deleteObjectStore("task");
    }

    var store = db.createObjectStore("task");
  };

  request.onsuccess = function(e) {
    focusApp.indexedDB.db = e.target.result;
    focusApp.indexedDB.showTask();
  };

  request.onerror = focusApp.indexedDB.onerror;
};

focusApp.indexedDB.updateTask = function(taskText) {
  var db = focusApp.indexedDB.db;

  var trans = db.transaction(["task"], "readwrite");
  var store = trans.objectStore("task");
  var request = store.put({
    "text": taskText,
      "timeStamp": new Date().getTime()
  }, 1);

  request.onerror = function(e) {
    console.log(e.value);
  };
};

focusApp.indexedDB.showTask = function() {
  $("#todo").val("");

  var db = focusApp.indexedDB.db;
  var trans = db.transaction(["task"], "readwrite");
  var store = trans.objectStore("task");

  //Get the only item
  var request = store.get(1);

  request.onsuccess = function(e) {
    var task = e.target.result.text;
    $("#todo").val(task);
  };

  request.onerror = focusApp.indexedDB.onerror;
};

