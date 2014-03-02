
/* The presenter */

(function() { 'use strict';
  /*
    A Model instance exposed to global space so you can
    use the Todo APi from the console. For example:

    todo.add("My task");
  */

  var updateCounter = function(){
    $("#flagcount").text(lax.getSelectionCount()+" of "+lax.getImagesInViewCount() + " selected");

    if(lax.getSelectionCount()>0) $("#edit").show();
    else $("#edit").hide();

  };


  var updateButtonStatus = function(){
    if(lax.isEditMode())
      $("#select, #deselect, #flagbutton").attr("disabled", "disabled");
    else
      $("#select, #deselect, #flagbutton").removeAttr("disabled");
  };

  var renderImages = function(){
    lhsview.empty();
    $($.render(resulttemplate)).appendTo(lhsview);

    var resultview = $("#resultview");

    //$("#resultview figure").remove("figure");
    var images = lax.getImages();
    images.forEach(function(element){
      //element = JSON.parse(element);
      var item = {id: element, name: element};
      $($.render(imagetemplate, item)).appendTo(resultview);
    });

    $("figure img").click(function(){
      var image = $(this).attr("id");
      lax.chooseImage(image);
    });

    $("figure button").click(function(){
      $(this).parent().toggleClass("marked");
      if($(this).parent().hasClass("marked")){
        $(this).text("unflag");
        lax.selectImage($(this).parent().children().first().attr("id"));
      }else{
        $(this).text("flag");
        lax.deselectImage($(this).parent().children().first().attr("id"));
      }
    });
  };

  var renderDetailView = function(){
    lhsview.empty();
    $("#resultview figure").remove("figure");
    var image = lax.getDetailImage();
    var item = {name: image};
    $($.render(detailtemplate, item)).appendTo(lhsview);

    $("#close").click(function(){
      renderImages();
      lax.deselectAll();
      lax.deactivateEditMode();
    });

    $("#next").click(function(){
      lax.nextImage();
    });

    $("#previous").click(function(){
      lax.previousImage();
    });

    lax.deselectAll();
    lax.selectImage(image);
    lax.activateEditMode();
  };

  var renderBox = function(list, node){
    list.forEach(function(element){
      var item = {size: "small", tag: element};
      $($.render(tagtemplate, item)).appendTo(node);
    });
  };

  var renderTags = function(){
    $("#tagcloud").empty();
    if(lax.isEditMode()) editbox.empty();

    else $("#query").empty();

    var tags = [];
    if(lax.isEditMode()){
      tags = lax.getTagCloudForSelection();
      if(tags.length===0) $($.render(infotemplate)).appendTo(tagcloudview);
    } else{
      tags = lax.getTags();
    }

    tags.forEach(function(element){
      var item = {size: element.weight, tag: element.tag, type:element.type};
      $($.render(tagtemplate, item)).appendTo(tagcloudview);
    });

    if(lax.isEditMode()) renderBox(lax.getEditTags(), editbox);
    else renderBox(lax.getQueryTags(), querybox);

    $("#tabs button").removeClass("active");
    console.log(lax.getTypeMode());
    $("button."+lax.getTypeMode()).addClass("active");
    //+lax.getTypeMode).addClass("active");

    $("#tagcloud .tag span").click(function(e){
      var tagtext = $(this).text();
      if(lax.isEditMode()) lax.addTagToEdit(tagtext);
      else lax.addTagToQuery(tagtext);
    });


    $(".tag button").click(function(e){
      var tagtext = $(this).parent().children().first().text();
      if(lax.isEditMode()) lax.removeTagFromEdit(tagtext);
      else lax.removeTagFromQuery(tagtext);
    });

    $("#tagcloud .tag").draggable({ stack: ".tag" });

    $(".tab").droppable({
      hoverClass: "drophover",
      activeClass: "droptarget",
      drop: function( event, ui ) {
        var tagtext = ui.draggable.children().first().text();
        var typetext = $(this).text();
        if(typetext==="all") return;
        console.log(tagtext);
        console.log(typetext);
        lax.changeTagType(tagtext, typetext);
      }
    });

  };

  var changesUnsaved = function(){
    $("h2").append(" <span>unsaved changes</span>");
  };

  var renderRHS = function(){
    rhsview.empty();
    /*if(lax.isEditMode()){

      editbox = $("#selection");
    } else {

      querybox = $("#query");

      $("#querybox button").click(function(){
        lax.resetQuery();
      });
    }
    tagcloudview = $("#tagcloud");*/
    //renderTags();
    var filterTagcloud = new FilterTagcloud();
    var editTagcloud = new EditTagcloud();

    if(lax.isEditMode()){
      $($.render(edittemplate)).appendTo(rhsview);
      editTagcloud.render();

      editbox = new Editbox($("#selection"));
      editbox.render();
      editbox.searchBoxListeners();

    } else{
      $($.render(filtertemplate)).appendTo(rhsview);
      filterTagcloud.render();
      querybox = new Querybox($("#query"));
      querybox.render();
      querybox.searchBoxListeners();
    }

    /*$("#searchfield").keyup(function(e){
      //e.preventDefault();
      if(e.which===13){
        var tagtext = $("#tagcloud").children().first().children().first().text();
        if(lax.isEditMode()){
          if (tagtext) lax.addTagToEdit(tagtext);
          else{
            lax.addTagToEdit($(this).text());
          }
        }
        else lax.addTagToQuery(tagtext);
        return false;
      }

      var text = $("#searchfield").text();
      lax.setSearchString(text);
      $(this).attr("size", text.length);
      return true;
    }); */


    $("button#edit").click(function(){
      lax.toggleEditMode();
    });

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
  };


  window.lax = new Laxaelv();

  // HTML for a single todo item
  var imagetemplate = $("[type='html/tumb']").html();
  var tagtemplate = $("[type='html/tag']").html();
  var filtertemplate = $("[type='html/filter']").html();
  var edittemplate = $("[type='html/edit']").html();
  var resulttemplate = $("[type='html/result']").html();
  var detailtemplate = $("[type='html/detail']").html();
  var infotemplate = $("[type='html/info']").html();

  var rhsview = $("section#filter");
  var lhsview = $("#lhsview");
  var tagcloudview = $("#tagcloud");
  var querybox = $("#query");
  var editbox = $("#tagselection");



  $("footer#result button#deselect").click(function(){
    $("figure").removeClass("marked");
    $("figure button").text("flag");
    lax.deselectAll();
  });
  $("footer#result button#select").click(function(){
    $("figure").addClass("marked");
    $("figure button").text("unflag");
    lax.selectAll();
  });

  $(document).keydown(function( event ) {
    //event.preventDefault();
    event.cancelBubble = true;
    event.returnValue = false;
    if(event.which == 39){
      lax.nextImage();
    }
    if(event.which == 37){
      lax.previousImage();
    }

  });



  lax.on("change", function() {
    console.log("change event!");
    renderImages();
    renderRHS();
    //renderTags();
  });

  lax.on("selectchange change", function(){
    updateCounter();
  });

  lax.on("editchange", function(){
    console.log("editchange");
    renderRHS();
    updateCounter();
    changesUnsaved();
  });

  lax.on("modechange", function(){
    renderRHS();
    updateCounter();
    updateButtonStatus();
  });

  lax.on("typechange", function(){
    console.log("change event!");
    //renderRHS();
  });

  lax.on("detailchange", function(){
    renderDetailView();
    renderRHS();
    updateCounter();
  });

  lax.initDB();

  $("#querybox button").click(function(){
    lax.resetQuery();
  });


})();