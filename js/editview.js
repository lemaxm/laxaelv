/* Editview presenter */

function EditView(){
    // Templates
    var edittemplate = $("[type='html/edit']").html();
    var rhsview = $("section#filter");
    // Elements

    // Functions
    this.render =function(){
        rhsview.empty();

        var editTagcloud = new EditTagcloud();
        $($.render(edittemplate)).appendTo(rhsview);
        editTagcloud.render();

        editbox = new Editbox($("#selection"));
        editbox.render();
        editbox.searchBoxListeners();
    };

    this.controlListeners = function(){
        $("button#cancel").click(function(){
            lax.toggleEditMode();
            //After cancel the current selection should be discarded
            lax.deselectAll();
        });

        $("button#save").click(function(){
            lax.saveChanges();
        });

        $("#tabs button").removeClass("active");
        $("#tabs button."+lax.getTypeMode()).addClass("active");
        $(".tab").click(function(){
                var type = $(this).text();
                lax.setTypeMode(type);
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

    // Events
}