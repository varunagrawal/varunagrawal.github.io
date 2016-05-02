console.log('This would be the main JS file.');

function getQuote(){
    // Quote courtesy of Quotes On Design "http://quotesondesign.com/api-v4-0/"
    console.log("Getting quote");
    $.ajax({
        url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',
        success: function(data) {
            // Data is an array of size 1, so get the first one.
            var quote = data.shift();

            // add the quote to the webpage
            $("#quote").html(quote.content + "\n - " + quote.title);
        },
        cache: false
    });
}

$(function(){
    $("[data-toggle='tooltip']").tooltip();

    getQuote();
});
