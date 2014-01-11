var focusApp = {};
focusApp.indexedDB = {};

focusApp.indexedDB.db = null;

focusApp.indexedDB.open = function() {
  var version = 1;
  var request = indexedDB.open("todos", version);

  request.onupgradeneeded = function(e) {
    var db = e.target.result;

    //A versionchange transaction is started automatically.
    e.target.transaction.onerror = focusApp.indexedDB.onerror;

    if(db.objectStoreNames.contains("todo")) {
      db.deleteObjectStore("todo");
    }

    var store = db.createObjectStore("todo" , {keyPath: "timeStamp"});
  };

  request.onsuccess = function(e) {
    focusApp.indexedDB.db = e.target.result;
    focusApp.indexedDB.getAllTodoItems();
  };

  request.onerror = focusApp.indexedDB.onerror;
};

focusApp.indexedDB.addTodo = function(todoText) {
  var db = focusApp.indexedDB.db;

  var trans = db.transaction(["todo"], "readwrite");
  var store = trans.objectStore("todo"); //Get object store reference
  var request = store.put({
    "text": todoText,
    "timeStamp" : new Date().getTime()
  }); //put request

  // If put request was succesful, the onsuccess callback is executed
  request.onsucces = function(e) {
    //Re-render all todos
    focusApp.indexedDB.getAllTodoItems();
  };

  request.onerror = function(e) {
    console.log(e.value);
  };
};

focusApp.indexedDB.getAllTodoItems = function() {
  var todos = document.getElementById("todoItems");
  todos.innerHTML = "";

  var db = focusApp.indexedDB.db;
  var trans = db.transaction(["todo"], "readwrite");
  var store = trans.objectStore("todo");

  //Get everything in the store;
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false)
      return;

    renderTodo(result.value);
    result.continue();
  };

  cursorRequest.onerror = focusApp.indexedDB.onerror;
};

function renderTodo(row) {
  var todos = document.getElementById("todoItems");
  var li = document.createElement("li");
  var a = document.createElement("a");
  var t = document.createTextNode(row.text);

  a.addEventListener("click", function(e) {
    focusApp.indexedDB.deleteTodo(row.timeStamp);
  });
  a.href = "#";
  a.textContent = " [Delete]";
  li.appendChild(t);
  li.appendChild(a);
  todos.appendChild(li);
}

focusApp.indexedDB.deleteTodo = function(id) {
  var db = focusApp.indexedDB.db;
  var trans = db.transaction(["todo"], "readwrite");
  var store = trans.objectStore("todo");

  var request = store.delete(id);

  request.onsuccess = function(e) {
    focusApp.indexedDB.getAllTodoItems();
  };

  request.onerror = function(e) {
    console.log(e);
  };
};

function init() {
  focusApp.indexedDB.open();
}

window.addEventListener("DOMContentLoaded", init, false);

function addTodo() {
  var todo = document.getElementById('todo');

  focusApp.indexedDB.addTodo(todo.value);
  todo.value = '';
}

