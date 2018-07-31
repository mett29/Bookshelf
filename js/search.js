var $ = require('jquery');

var books = require('google-books-search');

var options = {
    field: 'title',
    offset: 0,
    limit: 10,
    type: 'books',
    order: 'relevance',
    lang: 'it'
};

var electron = require('electron');
var {ipcRenderer} = electron;

ipcRenderer.on('info', (event, title) => {
    books.search(title, options, function(error, results) {
        if (!error) {
            var htmlString = "<div>";
            // For each of the JSON API results... 
            $.each(results, function (i, item) {
                htmlString += '<section>';
                htmlString += '<div class="row">';
                htmlString += '<div class="col-md-4 col-sm-4 col-xs-10">';
                htmlString += '<img class="img-thumbnail" src="' + item.thumbnail + '" title="' + item.id + '",/></div><br>';
                htmlString += '<div class="col-md-8 col-sm-8 col-xs-14">';
                htmlString += '<div class="about-content text-center">';
                htmlString += '<h1>' + item.title + '</h1>';
                $.each(item.authors, function (i, author) {
                    htmlString += '<p class="bg-info"><i>' + author + '</i></p>';
                });
                htmlString += '<p class="small">' + item.description + '</p>';
                htmlString += '<strong class="small">Average Rating: ' + item.averageRating + '</strong><br>';
                htmlString += '<strong class="small">Number of pages: ' + item.pageCount + '</strong><br>';
                htmlString += '<input type="button" class="btn btn-small btn-primary" id="readThisBook" onclick="readThisBook(\'' + item.thumbnail + '\')" value="I read this book">'
                htmlString += '</div></div></section>';
                htmlString += '<hr>'
            });

            $('#book').html(htmlString + "</div>");

        } else {
            console.log(error);
        }
    });
});

$('#backBtn').on('click', () => {
    ipcRenderer.send('back', "");
});

function readThisBook(thumbnail) {
    ipcRenderer.send('readThis', thumbnail);
}

