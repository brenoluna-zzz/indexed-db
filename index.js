// Create needed constants
const list = document.querySelector('ul');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');

// variable to hold the database object
let db;

window.onload = function() {
  // Open our database; it is created if it doesn't already exist with more code below this
  let request = window.indexedDB.open('notes_db',1);

  request.onerror = function() {
    console.log('Database failed to open');
  }

  request.onsuccess = function() {
    console.log('Database opened successfully');
    // Store the opened database object in the db variable
    db = request.result;
    // Run the displayData() function to display the notes already in the IDB
    displayData();    
  }

  // Setup the database tables if this has not already been done
  request.onupgradeneeded = function(e) {
    // Grab a reference to the data base from the event targer, once 'onsuccess' won't have run yet
    let db = e.target.result;
    // Create an objectStore (analogous to db tables) to store our notes
    let objectStore = db.createObjectStore('notes_os', { keyPath: 'id', autoIncrement: true });
    // Define what data items the objectStore will contain
    objectStore.createIndex('title', 'title', { unique: false });
    objectStore.createIndex('body', 'title', { unique: false });

    console.log('Database setup complete');
  }

  // Creates an object store item from the form data
  form.onsubmit = addData;

  function addData(e) {
    // Prevent ruining the experience by preventing page reload
    e.preventDefault;

    // Grab the values from the form
    let newItem = { title: titleInput.value, body: bodyInput.value };

    // open a read/write db transaction, ready for adding the data
    let transaction = db.transaction('notes_os', 'readwrite');

    
  }

}