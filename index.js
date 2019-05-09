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

  // Define the displayData() function
  function displayData() {
    // Remove any existing item from the DOM to avoid duplicates
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    // Open the object store and get a cursos to iterate through its items
    let objectStore = db.transaction('notes_os').objectStore('notes_os');
    objectStore.openCursor().onsuccess = function(e) {
      let cursor = e.target.result;

      // Keep going if there still another data item
      if(cursor) {
        // Create the DOM elements that make up the note
        let listItem = document.createElement('li');
        let h3 = document.createElement('h3');
        let para = document.createElement('p');

        listItem.appendChild(h3);
        listItem.appendChild(para);
        list.appendChild(listItem);

        // Put the data from the cursor inside the h3 and para
        h3.textContent = h3;
        para.textContent = para;

        // Store the ID of the data item inside an attribute on the listItem, so we know which item it corresponds to. This will be useful later when we want to delete items
        listItem.setAttribute('data-note-id', cursor.value.id);

        // Create and place the delete button
        let deleteBtn = document.createElement('button');
        listItem.appendChild(deleteBtn);
        deleteBtn.textContent = 'Delete';

        // deleteBtn event handler
        deleteBtn.onclick = deleteItem;

        // Iterate to the next cursor
        cursor.continue();
      } else {
        // Display a 'no notes stored' in case the list item is empty
        if(!list.firstChild) {
          let listItem = document.createElement('li');
          listItem.textContent = 'No notes stores.'
          list.appendChild(listItem);
        }
        // if there are no more cursor items to iterate through, say so
        console.log('Notes all displayed');
      }
    }

  }

}