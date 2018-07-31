var $ = require('jquery');

var electron = require('electron');
var {ipcRenderer} = electron;
var Store = require('electron-store');
var store = new Store();

var books = require('google-books-search');

loadThumbnails();

ipcRenderer.on('readThis', (event, thumbnail) => {
    let thumbnails = [];
    // Retrieved cached data and append the new one
    thumbnails.push(thumbnail);
    for (let index in store.store) {
        if (!thumbnails.includes(store.store[index])) {
            thumbnails.push(store.store[index]);
        }
    }
    store.clear();
    store.set(thumbnails);
    loadThumbnails();
});

function loadThumbnails() {
    // Load thumbnails of read books
    let thumbnails = store.store;
    for (var i = 0; i < Object.keys(thumbnails).length; i++) {
        let counter = 0;
        $('#thumbs').find('img').each(function() {
            if (counter == i) {
                $(this).attr("src", thumbnails[i]); 
            }
            counter += 1; 
        });
    }    
}

// Search for a specific book
function searchBook(title) {
    ipcRenderer.send('book_search', title);
}

$('#searchBtn').on('click', () => {
    let title = $('#item').val();
    searchBook(title);
})