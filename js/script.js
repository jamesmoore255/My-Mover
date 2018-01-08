
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");


    // Google Streetview API


    // retrieving the values from the input forms of street and city 
    var $streetStr = $( "#street" ).val();
    var $cityStr = $( "#city" ).val();
    // retrieving the values from the input forms of street and city 
    var $streetStr = $( "#street" ).val();
    var $cityStr = $( "#city" ).val();
    // joining city and street into one sentence, making for more readable coding
    var $address = $streetStr + ", " + $cityStr;
    // joining city and street into one sentence, making for more readable coding
    var $address = $streetStr + ", " + $cityStr;
    // retrieving the streetview API image, and putting it into an object, to append more easily
    var $streetviewURL = "https://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + $address;

    $greeting.text('So you want to live at ' + $address + '?');

    // appending the image to the body, CSS does the rest!
    $body.append( '<img class="bgimg"src="' + $streetviewURL + '"">');


    // NYTIMES AJAX request


    // Retrieving the proper nytimes json request, specifying the request using
    // the object cityStr as the location, sorting it by newest, and putting in my api key
    var $nytAPI = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + $cityStr + "&sort=newest&api-key=b561a70614d64860a6962d3963808115";
    // getJson request, using the nytAPI URL, and the function(data),
    // which is anonymous and used to store the data associated with nytAPI
    $.getJSON($nytAPI, function(data){

        // altering the text of the nytHeaderElem, to represent the city
        $nytHeaderElem.text('New York Times Articles About ' + $cityStr);

        // an articles object is called, storing the different attributes of the NYT articles
        // data.response.docs refers to the network developer tools, in this you can find the
        // articlesearch XHR javascript document, which refers to the 'data' function,
        // in which you find a drop down for response, which provides you with a list of docs
        // all of which are articles. THIS RETURNS AN ARRAY.
        $articles = data.response.docs;
        // A for loop is created to create the list of articles we want, this loop states
        // while i < number of docs, +1 to i, until length is reached.
        for (var i = 0; i < $articles.length; i++) {
            // this is selecting one article out of an array of articles
            var $article = $articles[i];
            // This is appending the articles to the nytElem javascript object,
            // the nytElem returns these objects.
            $nytElem.append('<li class="article">' + 
                '<a href="' + $article.web_url +'">' + $article.headline.main + '</a>' +
                '<p>' + $article.snippet + '</p>' +
                '</li>');
        }
    })
    .error(function(e){
        $nytHeaderElem.text("We can't seem to find any articles for " + $cityStr )
    });


    // Wikipedia API

    // Setting timeout as there is no error function in jsonP
    var $wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources...");
    }, 8000);

    // wikiUrl put in a javascript object
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + $cityStr + '&format=json&callback=wikiCallBack'
    // wikipedia ajax request
    $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        success: function( response ) {
            // Putting relevant wikilinks into a variable
            $wikipages = response[1];

            for (var i = 0; i < $wikipages.length; i++) {
                var $wikipage = $wikipages[i];
                var $url = 'https://en.wikipedia.org/wiki/' + $wikipage;
                $wikiElem.append('<li class="article"><a href="' + $url + '">' + $wikipage + '</a></li>');
            };

            clearTimeout($wikiRequestTimeout);
        }

    });


    return false;
}

$('#form-container').submit(loadData);
