function renderCircle(ctx, x, y, radius, img) {

    ctx.save();
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, x, y, radius * 2, radius * 2);

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.closePath();
    ctx.restore();
};

$(function() {

    var c = $("#viewport")[0];
    var ctx = c.getContext("2d");
    var radius = 75;
    var x = ($(window).width()) / 2 - radius;
    var y = ($(window).height()) / 2 - (2 * radius);

    var selfImg = $("<img></img>")[0];
    selfImg.src = "https://www.gravatar.com/avatar/cc856652c4db97f4eacc9bffa6540ece?s=200";
    selfImg.onload = function() {
        renderCircle(ctx, x, y, radius, selfImg);
    };

});
