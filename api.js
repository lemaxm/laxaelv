
/* The model */

function Laxaelv() {

  var self = $.observable(this);

  var editMode = false;

  var query = [];
  var imagesInView = [];
  var selection = [];
  var editTags = [];

  var db;

  var weights = function(taglist){
    var imagecount = db.getTotalImageCount();

    var mapWeight = function(weight){
      if(weight<0.2) return "small";
      if(weight<0.5) return "medium";
      if(weight>=0.5) return "large";
    };

    taglist.forEach(function(element, index){
      var refCount = db.getReferenceCountForTag(element);
      var weight = refCount/imagecount;

      var weightclass = mapWeight(weight);
      taglist[index] = {tag:element, weight:weightclass};
    });

    return taglist;
  };

  self.initDB = function(){
    db = new DataBase();
    /*console.log(db.getImages(["house","pool"]));
    console.log(db.getCommonTags(["00044-konigsberg.jpg"]));
    console.log(db.getCommonTags(["00044-konigsberg.jpg","00045-poolhouse.jpg"]));*/
    console.log(db.getCommonTags(["00044-konigsberg.jpg","00045-poolhouse.jpg","00046-poolhouse.jpg"]));

    self.trigger("change");
  };


  self.getImages = function(){
    imagesInView = db.getImages(query);
    return imagesInView;
  };

  self.getTags = function(){
    console.log(imagesInView);
    var tags = db.getCommonTags(imagesInView);
    if(query.length > 0) tags = db.difference(tags, query);
    return weights(tags);
  };

  self.initEditTagsForSelection = function(){
    editTags = db.getCommonTags(selection, "intersection");
    //return editTags;
  };

  self.getEditTags = function(){
    return editTags;
  };

  self.getTagCloudForSelection = function(){
     var tags = db.getCommonTags();
     console.log(editTags);
     return weights(db.difference(tags, editTags));
  };

  self.getQueryTags = function(){
    return query;
  };

  self.getSelectionCount = function(){
    return selection.length;
  };

  self.getImagesInViewCount = function(){
    return imagesInView.length;
  };

  self.toggleEditMode = function(){
    editMode = !editMode;
    if(editMode) self.initEditTagsForSelection();
    self.trigger("modechange");
  };

  self.isEditMode = function(){
    return editMode;
  };

  self.saveChanges = function(){
    selection.forEach(function(image){
      db.addImage(image, editTags);
    });
    self.toggleEditMode();
  };


  self.addTagToEdit = function(tag){
    editTags.push(tag);
    self.trigger("editchange");
  };

  self.removeTagFromEdit = function(tag){
    editTags.splice(editTags.indexOf(tag), 1);
    self.trigger("editchange");
  };

  self.addTagToQuery = function(tag){
    query.push(tag);
    self.trigger("change");
  };

  self.removeTagFromQuery = function(tag){
    query.splice(query.indexOf(tag), 1);
    self.trigger("change");
  };

  self.resetQuery = function(){
    query = [];
    self.trigger("change");
  };

  self.selectImage = function(image){
    selection.push(image);
    self.trigger("selectchange");
  };

  self.deselectImage = function(image){
    selection.splice(selection.indexOf(image), 1);
    self.trigger("selectchange");
  };

  self.selectAll = function(){
    selection = [];
    for(var image in imagesInView)
      selection.push(imagesInView[image]);
    self.trigger("selectchange");
  };


  self.deselectAll = function(){
    selection = [];
    self.trigger("selectchange");
  };

}