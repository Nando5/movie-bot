console.log("Movie Bot - main.js");

// Make sure only movies with trailers/posters/overview are returned
// Make sure no duplicates
// Return in alphabetical Order
// Apply clicked movie title into search bar
// Fix gradient
// Optimise for mobile
// secure it

var movieTrailer;
var movieTitle;
var movieOverview;
var movieReleaseDate;
var moviePosterId;
var id;
var inputFromUser;
var newSearch = true;

    $(".search-movie").click(function(){
        inputFromUser = $("input:text").val();
        newSearch = true;
        getMovieId(inputFromUser);
    });

    $(".remove-video").click(function(){
        $(".embed-responsive").empty();
    });


var getMovieId = function(inputFromUser){
    var request = new XMLHttpRequest();
    var url = "https://api.themoviedb.org/3/search/movie?api_key=49577619c032f7a6381ddea81fe3b52c&query=" + inputFromUser;

    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
        var response = JSON.parse(this.responseText);
        getElements(response);
        }
    }

    request.open("GET", url, true);
    request.send();

    getElements = function(response) {
        id = response;
        if (newSearch){
            getAllMovieTitles(id);
            newSearch = false;
        }
        getMovieInfo(id.results[0].id);
    }
};

var getAllMovieTitles = function(){
    $(".list-of-movies").empty();
    var counter = id.results.length;

    for (i = 0; i < counter; i++) { 
        $(".list-of-movies").append("<a href='#/'><li data-val='"+ id.results[i].title +"'>" + id.results[i].title + "</li></a>");
    }
    $('li').click(function() {
        // alert($(this).data('val'));
        var selectedMovie = $(this).data('val');
        getMovieId(selectedMovie);
    });
};


var getMovieInfo = function(movieId){

    var request = new XMLHttpRequest();
    var url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=49577619c032f7a6381ddea81fe3b52c&append_to_response=videos";

    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
        var response = JSON.parse(this.responseText);
        getElements(response);
        }
    }

    request.open("GET", url, true);
    request.send();

    getElements = function(response) {
        movieTrailer = response.videos.results[0].key;
        movieTitle = response.title;
        movieOverview = response.overview;
        movieReleaseDate = response.release_date;
        moviePosterId = response.poster_path;


        console.log(movieTitle);
        console.log(movieOverview);
        console.log(movieReleaseDate);
        console.log(response);

        embedMovieDetailsHTML(movieTitle,movieReleaseDate,movieOverview);
        embedMoviePosterHTML(moviePosterId);
        embedVideoInHTML(movieTrailer);
    }
};

var embedMovieDetailsHTML = function(movieTitle,movieReleaseDate,movieOverview){
    $(".movie-details").empty();
    $(".movie-details").append("<h2>"+ movieTitle + "</h2>" +
                                movieOverview + "<br><br><p><i>Released: " + movieReleaseDate + "</i>"); 
                                
};

var embedMoviePosterHTML = function(moviePosterId){
    $(".movie-poster").empty();
    $(".movie-poster").append("<img class='img-fluid' src='https://image.tmdb.org/t/p/w300_and_h450_bestv2" + moviePosterId + "'>");
};

var embedVideoInHTML = function(movieTrailer){
    $(".embed-responsive").empty();
    $(".embed-responsive").append("<iframe class='embed-responsive-item' src='https://www.youtube.com/embed/" + movieTrailer + "?rel=0' allowfullscreen></iframe>");
};

