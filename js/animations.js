var cartPrice = 0;

$(document).ready(function() {

    // Slowly show map picker view
    $('#map-container').fadeIn("slow");

    // Bind click event for city icons
    $('.cinema-icon').click(function() {

        $('#logo').append('<span><a class="city-name"> - ' + $(this).attr('id') + '</a></span>');

        $('#map-container').fadeOut("fast", function() {

            // Slowly show main view
            $('#main').fadeIn("slow");

            // Load carousel
            carouselImages();

            // Load movies
            showingMovies();

            // Bind click events for movies
            bindClickEvents("movies");

            // Fade in movies one by one
            $(".showing .movie").each(function(i) {
                var $movie = $(this);
                setTimeout(function() {
                    $movie.css("display", "flex").fadeIn("slow");
                }, 200 * (i + 1));
            });
        });
    });

    // Handle hovering on the movies sub-menu
    $('.sub-menu-parent').hover(function() {
        $('.sub-menu-parent').addClass('hovered');
    }, function() {
        $('.sub-menu-parent').removeClass('hovered');
    });

    // Bind click events for movies sub-menu
    bindClickEvents("menu");
});

var carouselImages = function() {
    // Loop through upcoming movies and append data
    $.each(upcomingMovies, function(key, data) {
        $.each(data, function(index, movies) {
            $("#carousel-images").append("<div class='movie-image' id='" + index + "'><div><img id='" + index + "' src='" + movies.posterUrl + "'></img><span class='click-instruction'>Click to show details</span></div></div>");
            setTimeout(function() {
                $("#carousel-images").find('.movie-image#' + index).addClass("slideLeft");
            }, 200 * (index + 1));
            $('.movie-image#' + index).click(function() {
                $('#carousel-details').empty();
                $('#carousel-details').show();
                $('#carousel-details').animate({
                    maxHeight: '0',
                    opacity: '0'
                }, 400, function() {
                    $('#carousel-details').append('<h2 class="title">' + movies.name + '</h2>');
                    $('#carousel-details').append('<p class="synopsis">Plot: ' + movies.synopsis + '</p>');
                    $('#carousel-details').append('<p class="details">Coming on: ' + movies.date + '</p>');
                    $('#carousel-details').animate({
                        maxHeight: '150px',
                        opacity: '1'
                    }, 400);
                });
            })
        })
    })
};

var showingMovies = function() {

    // Loop through movies showing today and append data
    $.each(showingToday, function(key, data) {
        $.each(data, function(index, movies) {
            $(".showing.today").append('<div class="movie" id="today-movie-' + index + '">' +
                '<span class="time"></span>' +
                '<div class="poster-container"><img class="poster" src="#"></img></div>' +
                '<div class="details-container">' +
                '<h2 class="title"></h2>' +
                '<p class="details"></p>' +
                '<p class="synopsis"></p></div>' +
                '<div class="actions-container">' +
                '<h3 class="price-per-unit">12 €</h3>' +
                '<div class="add-remove-tickets">' +
                '<span class="current-price"></span>' +
                '<div class="add-remove-container">' +
                '<button class="add-button" id="' + index + '">+</button>' +
                '<button class="remove-button" id="' + index + '">-</button></div>' +
                '<p class="price-label">Price to pay :</p>' +
                '<p class="price-to-pay">0 €</p>' +
                '<span class="tickets" id="tickets-' + index + '"></span>' +
                '<p><a class="add-to-cart">Add To Cart</a></p></div></div></div>');

            $("#today-movie-" + (index) + " .time").text(movies.time);
            $("#today-movie-" + (index) + " .poster").attr("src", movies.posterUrl);
            $("#today-movie-" + (index) + " .title").text(movies.name);
            $("#today-movie-" + (index) + " .synopsis").text(movies.synopsis);
            $("#today-movie-" + (index) + " .details").text(movies.duration);
        })
    });

    // Loop through movies showing tomorrow and append
    $.each(showingTomorrow, function(key, data) {
        $.each(data, function(index, movies) {
            $(".showing.tomorrow").append('<div class="movie" id="tomorrow-movie-' + index + '">' +
                '<span class="time"></span>' +
                '<div class="poster-container"><img class="poster" src="#"></img></div>' +
                '<div class="details-container">' +
                '<h2 class="title"></h2>' +
                '<p class="details"></p>' +
                '<p class="synopsis"></p></div>' +
                '<div class="actions-container">' +
                '<h3 class="price-per-unit">12 €</h3>' +
                '<div class="add-remove-tickets">' +
                '<span class="current-price"></span>' +
                '<div class="add-remove-container">' +
                '<button class="add-button" id="' + index + '">+</button>' +
                '<button class="remove-button" id="' + index + '">-</button></div>' +
                '<p class="price-label">Price to pay :</p>' +
                '<p class="price-to-pay">0 €</p>' +
                '<span class="tickets" id="tickets-' + index + '"></span>' +
                '<p><a class="add-to-cart">Add To Cart</a></p></div></div></div>');

            $("#tomorrow-movie-" + (index) + " .time").text(movies.time);
            $("#tomorrow-movie-" + (index) + " .poster").attr("src", movies.posterUrl);
            $("#tomorrow-movie-" + (index) + " .title").text(movies.name);
            $("#tomorrow-movie-" + (index) + " .synopsis").text(movies.synopsis);
            $("#tomorrow-movie-" + (index) + " .details").text(movies.duration);
        })
    });
};

var bindClickEvents = function(view) {

    if (view === "menu") {

        // Slide to today's movies
        $('#today').click(function() {
            if ($('#chosen-day').text() !== 'Today') {
                $('a#chosen-day').text('Today');
                $('#tomorrow').removeClass('selected');
                $('#today').addClass('selected');
                $('.sub-menu-parent').removeClass('hovered');
                $('.showing.tomorrow').removeClass('active');
                $('.showing.today').addClass('active');
            }
        });

        // Slide to tomorrow's movies
        $('#tomorrow').click(function() {
            if ($('#chosen-day').text() !== 'Tomorrow') {
                $('a#chosen-day').text('Tomorrow');
                $('#today').removeClass('selected');
                $('#tomorrow').addClass('selected');
                $('.sub-menu-parent').removeClass('hovered');
                $('.showing.today').removeClass('active');
                $('.showing.tomorrow').addClass('active');
            }
        });

    } else if (view === "movies") {

        var bindAddRemove = function (showing) {

            // Add ticket and update price
            $('.' + showing + ' .add-button').click(function() {
                var id = $(this).attr('id');
                $('.minicart').removeClass('cartWobble');
                $("#" + showing + "-movie-" + (id) + " .price-to-pay").removeClass('priceHighlight');
                var currentPrice = parseInt($("#" + showing + "-movie-" + (id) + " .price-to-pay").text());
                var ticketImage = $('<img src="images/ticket.png"/>');
                $('.' + showing + ' #tickets-' + id).append(ticketImage);
                setTimeout(function() {
                    $('.' + showing + ' #tickets-' + id).children().last().addClass('show');
                    var newPrice = currentPrice + 12;
                    $("#" + showing + "-movie-" + (id) + " .price-to-pay").text(newPrice + ' €').addClass('priceHighlight');
                    $("#" + showing + "-movie-" + (id) + " .add-to-cart").css('display', 'block');
                }, 100);
            });

            // Remove ticket and update price
            $('.' + showing + ' .remove-button').click(function() {
                var id = $(this).attr('id');
                $("#" + showing + "-movie-" + (id) + " .price-to-pay").removeClass('priceHighlight');
                var currentPrice = parseInt($("#" + showing + "-movie-" + (id) + " .price-to-pay").text());
                $('.' + showing + ' #tickets-' + id).children().last().removeClass('show');
                setTimeout(function() {
                    if ($('.' + showing + ' #tickets-' + id).children().length > 0) {
                        var newPrice = currentPrice - 12;
                        $("#" + showing + "-movie-" + (id) + " .price-to-pay").text(newPrice + ' €').addClass('priceHighlight');
                    }
                    $('.' + showing + ' #tickets-' + id).children().last().remove();
                    if (!$('.' + showing + ' #tickets-' + id).children().length > 0) {
                        $("#" + showing + "-movie-" + (id) + " .add-to-cart").css('display', 'none');
                    }
                }, 100);
            });
        }

        bindAddRemove('today');
        bindAddRemove('tomorrow');

        // Select/Click on a particular movie and show actions
        $(".showing .movie").click(function() {
            $(".showing .movie").removeClass('clicked');
            $(this).addClass('clicked');
        });

        // Add tickets to cart and update cart price
        $('.add-to-cart').click(function() {
            cartPrice = cartPrice + parseInt($(this).closest('.add-remove-tickets').find('.price-to-pay').text());
            $('.cart-price').text(cartPrice + ' €').addClass('priceHighlight');
            $('.minicart').addClass('cartWobble');
            $(".showing .movie").removeClass('clicked');
            $(this).closest('.add-remove-tickets').find(".add-to-cart").css('display', 'none');
            $(this).closest('.add-remove-tickets').find('.price-to-pay').text('0 €');
            $(this).closest('.add-remove-tickets').find('.tickets').empty();

        });

        // Return to map
        $('.city-name').click(function() {
            $('#main').fadeOut("slow", function() {
                $("#logo").empty();
                $("#logo").text('NorthKino');
                $(".showing.tomorrow").empty();
                $(".showing.today").empty();
                $("#carousel-images").empty();
                $('#map-container').fadeIn("slow");
            });

        });
    }
}
