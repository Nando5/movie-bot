$(document).ready(function(){

var moviesChecked = false;
var moviesToCheck = 0;
var counter = 0;
var inputFromUser;
var moviesObject = [];
var selectedMovie;
var defaultResponse = {
    results: [
        {id: 299536},
        {id: 329},
        {id: 278},
        {id: 155},
        {id: 240},
        {id: 284053},
        {id: 424},
        {id: 348350},
        {id: 122},
        {id: 550},
        {id: 769},
        {id: 603},
        {id: 280},
        {id: 9509},
        {id: 2034},
        {id: 157336},
        {id: 14160},
        {id: 107},
        {id: 680},
        {id: 312221}
    ]
}
    $(".enable-collapse").click(function(){
        $(this).text($(this).text() === 'VIEW LESS' ? 'VIEW ALL' : 'VIEW LESS');
    });
    
    $(".search-movie").click(function(){
        searchHasCommenced();
    });

    $(".list-heading").click(function(){
        defaultMovieList(defaultResponse);
    });

var input = document.getElementById("myInput");
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        searchHasCommenced();
    }
});

var searchHasCommenced = function() {
    $(".search-result-status").empty();
    moviesChecked = false;
    counter = 0;
    moviesObject = [];
    inputFromUser = $("input:text").val();
    getMovieId(inputFromUser);
};

var getMovieId = function(inputFromUser){
    var request = new XMLHttpRequest();
    var url = "https://api.themoviedb.org/3/search/movie?api_key=49577619c032f7a6381ddea81fe3b52c&query=" + inputFromUser;

    request.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
        var response = JSON.parse(this.responseText);
        if (response.results.length === 0){
            noResultsFound();
            return;
        }
        getElements(response);
        }
    }

    request.open("GET", url, true);
    request.send();

    getElements = function(response) {
        moviesToCheck = response.results.length;
        for (i = 0; i < response.results.length; i++) {
            getMovieInfo(response.results[i].id);
            if (i === response.results.length-1){
                moviesChecked = true;
                $(".search-result-status").append("<i>We found you some movies :)</i>");
            }
        }
    }
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
        makeMovieObject(response);
    }
};

var makeMovieObject = function(response) {
    function Movie(movieTitle, movieReleaseDate, movieOverview, moviePosterId, movieTrailer) {
        this.movieTitle = movieTitle;
        this.movieReleaseDate = movieReleaseDate;
        this.movieOverview = movieOverview;
        this.moviePosterId = moviePosterId;
        this.movieTrailer = movieTrailer;
        this.posterPath = function() {
            return "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + moviePosterId;
        }
        this.videoUrl = function() {
            return "https://www.youtube.com/embed/" + movieTrailer;
        }

    };
    if (response.videos.results[0]) {
        counter = counter + 1;
        moviesObject.push(new Movie(response.title, 
                                    response.release_date, 
                                    response.overview, 
                                    response.poster_path,
                                    response.videos.results[0].key
                                    ));
    } else {
        counter = counter + 1;
        if ((counter === moviesToCheck) && (moviesObject.length === 0)) {
            noResultsFound();
        }
        return;
    };
    if (moviesChecked) {
        listMovies(moviesObject);
    };
};

var noResultsFound = function() {
    $(".search-result-status").empty();
    $(".list-of-movies").empty();
    $(".search-result-status").append("<i>Sorry, we couldn't find that movie :(</i>");
};

var listMovies = function(moviesObject){
    $(".list-of-movies").empty();
    var counter = moviesObject.length;
        for (i = 0; i < counter; i++) { 
            var counter = moviesObject.length;
                $(".list-of-movies").append("<a href='#/'><li data-val='"+ i +"'>" + moviesObject[i].movieTitle + "</li></a>");
        }

    selectedMovie = 0;
    renderMovie(selectedMovie);

    $('li').click(function() {
        selectedMovie = $(this).data('val');
        
        //collapse list of movies once movie is selected - only when collapse func is on.
        if($('.enable-collapse').is(':visible')) {
            $('.enable-collapse').click();
        }
        renderMovie(selectedMovie);
        
    });
};

var renderMovie = function(selectedMovie) {

    var movieTitle = moviesObject[selectedMovie].movieTitle;
    var movieReleaseDate = moviesObject[selectedMovie].movieReleaseDate;
    var movieOverview = moviesObject[selectedMovie].movieOverview;
    var moviePosterId = moviesObject[selectedMovie].posterPath();
    var movieTrailer = moviesObject[selectedMovie].videoUrl();


    var embedMovieDetailsHTML = function(movieTitle,movieReleaseDate,movieOverview){
        $(".movie-details").empty();
        $(".movie-details").append("<h2>"+ movieTitle + "</h2>" +
                                    movieOverview + "<br><br><p><i>Released: " + movieReleaseDate + "</i>"); 
                                    
    };
    
    var embedMoviePosterHTML = function(moviePosterId){
        $(".movie-poster").empty();
        $(".movie-poster").append("<img class='img-fluid' src=" + moviePosterId + ">");
    };
    
    var embedVideoInHTML = function(movieTrailer){
        $(".embed-responsive").empty();
        $(".embed-responsive").append("<iframe class='embed-responsive-item' src=" + movieTrailer + "?rel=0:1' allowfullscreen></iframe>");
    };


    embedMovieDetailsHTML(movieTitle,movieReleaseDate,movieOverview);
    embedMoviePosterHTML(moviePosterId);
    embedVideoInHTML(movieTrailer);
};

var defaultMovieList = function(response) {
    $(".list-of-movies").empty();
    $(".search-result-status").empty();
    moviesObject = [];
    for (i = 0; i < response.results.length; i++) {
        getMovieInfo(response.results[i].id);
        if (i === response.results.length-1){
            moviesChecked = true;
        }
    }
}

defaultMovieList(defaultResponse);

});


















