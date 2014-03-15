/* Filterview presenter */

var FilterView = function(){
    // Templates
    var filtertemplate = $("[type='html/filter']").html();
    var rhsview = $("section#filter");

    //var filterTagcloud = new FilterTagcloud();
    var querybox = new Querybox();

    // Functions
    this.render =function(){
        var filterTagcloud = new FilterTagcloud();
        rhsview.empty();

        $($.render(filtertemplate)).appendTo(rhsview);
        filterTagcloud.render();
        //var querybox = new Querybox();
        querybox.render();
        querybox.searchBoxListeners();
        var clipboardview = new Clipboard();
    };

    this.controlListeners = function(){
        $("button#deselect").click(function(e){
            e.stopImmediatePropagation();
            $("figure").removeClass("marked");
            lax.deselectAll();
        });
        $("button#select").click(function(e){
            e.stopImmediatePropagation();
            $("figure").addClass("marked");
            lax.selectAll();
        });

        $(".tab").click(function(){
            var type = $(this).text();
            lax.setTypeMode(type);
        });

        $(".tab").droppable({
            hoverClass: "drophover",
            activeClass: "droptarget",
            drop: function( event, ui ) {
                var tagtext = ui.draggable.children().first().text();
                var typetext = $(this).text();
                if(typetext==="all") return;
                lax.changeTagType(tagtext, typetext);
            }
        });
    };

    return this;
};