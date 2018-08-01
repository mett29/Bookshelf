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
                if (item.averageRating != undefined) {
                    htmlString += '<p class="small">' + item.description + '</p>';
                }
                if (item.averageRating != undefined) {
                    htmlString += '<strong class="small">Average Rating: ' + item.averageRating + '</strong><br>';
                    let rating = '';
                    for (let i = 0; i < item.averageRating - 1; i++) {
                        rating += '<i class="fa fa-star"></i>';
                    }
                    if (!isInt(item.averageRating)) {
                        rating += '<i class="fa fa-star-half"></i>';
                    } else {
                        rating += '<i class="fa fa-star"></i>';
                    }
                    htmlString += '<div class="text-warning">' +
                                        rating + '\
                                    </div>';
                }
                htmlString += '<strong class="small">Number of pages: </strong><br>';
                htmlString += '<i class="fa fa-book"></i>  ' + item.pageCount + '<br><br>';
                htmlString += '<input type="button" class="btn btn-small btn-primary" id="readThisBook" onclick="readThisBook(\'' + item.thumbnail + '\')" value="I read this book">';
                htmlString += '</div></div></section>';
                htmlString += '<hr>';
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

function isInt(n) {
    return n % 1 === 0;
 }

