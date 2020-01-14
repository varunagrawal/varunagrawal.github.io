function getQuote(){
    // Quote courtesy of TheySaidSo.com "https://theysaidso.com/api/"
    console.log("Getting quote");
    $.ajax({
        url: "https://quotes.rest/qod.json",
        //url: 'https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',
        success: function(data) {
            // Data is an array of size 1, so get the first one.
            var quote = data.contents.quotes.shift();

            // add the quote to the webpage
            $("#quote").html(quote.quote + "\n - " + quote.author);
        },
        cache: false
    });
}

$(function(){
    $('[data-toggle="tooltip"]').tooltip();

    // getQuote();
});
