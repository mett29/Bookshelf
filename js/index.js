var $ = require('jquery');

var electron = require('electron');
var {ipcRenderer} = electron;
var Store = require('electron-store');
var store = new Store();

var books = require('google-books-search');

printContainer(Object.keys(store.store).length);
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
    printContainer(thumbnails.length);
    loadThumbnails();
});

function printContainer(n) {
    let htmlString = "";
    for (let i = 0; i < n; i++) {
        console.log(i);
        htmlString += '<div class="div_copertina"><img class="resize_vertical" id="div"' + i + 1 + '></div>';
    }
    $('#thumbs').html(htmlString + "");
}

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

$('.div_copertina').on('hover', () => {
    // Show details about that book

})