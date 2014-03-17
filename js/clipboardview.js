/* Clipboard presenter */

function Clipboard(){
    var clipboardtemplate = $("[type='html/clipboard']").html();

    var editbar = $("#footer");
    var domelement = $($.render(clipboardtemplate)).appendTo(editbar)[0];

    this.render = function(){
        //$(domelement).children("ul").empty();
        $(domelement).children("#miniatures").empty();
        var images = lax.getSelection();

        images.forEach(function(image){
            imagedata = {name: image};
            var miniature = new Miniature($(domelement).children("#miniatures"), imagedata);
        });

        var totalwidth = $("#clipboard").width()-500;
        var margin = totalwidth-(50*images.length);
        console.log("totalwidth "+totalwidth);
        console.log("margin"+margin);
        if (margin > 10 ) margin = 10;
        if (margin < -20) margin = -20;
        $(domelement).children("#miniatures").children().css('margin-left', margin);
        if (margin < 0 ){
            var padding = Math.min(10, margin*-1);
            $(domelement).css('padding-left', padding);
        }


        //
        /*var elementsize = Math.min(50, (totalwidth-(images.length*35))/images.length);
        elementsize = Math.max(5, elementsize);
        $(domelement).children().width(elementsize);
        $(domelement).children().height(elementsize);*/



    };


    // Events

    lax.on("selectchange", function(){
        this.render();
    }.bind(this));

    lax.on("modechange", function(){
        this.render();
    }.bind(this));

}


function Miniature(parentview, data){
    var thumbnailtemplate = $("[type='html/miniature']").html();

    $($.render(thumbnailtemplate, data)).appendTo(parentview);
}