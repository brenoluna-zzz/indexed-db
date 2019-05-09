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

    // Call an object store that's beem added to the database
    let objectStore = transaction.objectStore('notes_os');

    // Make a request to add the new item to the object store
    let request = objectStore.add(newItem);
    // If it succeeds, clear the form to add new entry
    request.onsuccess = function() {
      titleInput.value = '';
      bodyInput.value = '';
    }

    // Report on the success or failure of the transaction
    transaction.onsuccess = function() {
      console.log('Transaction completed: database modification finished.');
      // Update the diplayed items to include the new one
      displayData();
    }
    transaction.onerror = function() {
      console.log('Transaction not opened due to error');
    }
  }

}