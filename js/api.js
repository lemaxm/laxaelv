
/* The model */

function Laxaelv() {

  var self = $.observable(this);

  var detailMode = false;
  var editMode = false;
  var typeMode = 'all';
  var searchString = '';

  var query = [];
  var imagesInView = [];
  var selection = [];
  var editTags = [];
  var removeTags = [];

  var iterator = 0;
  var tagcache;

  var db;

  var weights = function(taglist){
    var imagecount = db.getTotalImageCount();

    var mapWeight = function(weight){
      if(taglist.length> 40 && weight<0.01) return "hidden";
      if(weight<0.2) return "small";
      if(weight<0.5) return "medium";
      if(weight>=0.5) return "large";
    };

    taglist.forEach(function(element, index){
      var refCount = db.getReferenceCountForTag(element);
      var weight = refCount/imagecount;
      var type = db.getTagType(element);

      var weightclass = mapWeight(weight);
      taglist[index] = {tag:element, weight:weightclass, type:type};
    });

    return taglist;
  };

  var filterTags = function(tags){
    var tmp = tags;
    if(self.typeMode!=='all' && self.typeMode) {
      tmp = db.getTagsOfType(self.typeMode,tags);
    }

    if(self.searchString) {
      tmp = tmp.filter( function(element) {
        return element.substring(0, self.searchString.length) === self.searchString;
      });
      if(tmp.length === 0 && self.typeMode !== 'all') {
        self.typeMode = 'all';
        self.trigger('typechange');
        return filterTags(tags);
      }
    }

    return tmp;
  };

  self.initDB = function(){
    db = new DataBase();
    self.trigger("change");
  };

  self.getDetailImage = function(){
    return imagesInView[iterator];
  };

  self.getDetailImageTags = function(){
    console.log(imagesInView[iterator]);
    var detailTags = db.getCommonTags([imagesInView[iterator]]);
    return detailTags;
  };

  self.nextImage = function(){
    iterator += 1;
    iterator = Math.min(iterator, imagesInView.length-1);
    self.trigger("detailchange");
  };

  self.previousImage = function(){
    iterator -=1;
    iterator = Math.max(iterator, 0);
    self.trigger("detailchange");
  };

  self.chooseImage = function(image){
    iterator = imagesInView.indexOf(image);
    detailMode = true;
    self.trigger("detailchange");
  };

  self.triggerDetails = function(image){
    iterator = imagesInView.indexOf(image);
    detailMode = true;
    self.trigger("detailrendering");
  };

  self.getImages = function(){
    imagesInView = db.getImages(query);
    tagcache = undefined;
    return imagesInView;
  };

  self.getTags = function(){

    if(!tagcache) tagcache = db.getCommonTags(imagesInView);
    var tags = tagcache.slice();

    if(query.length > 0) tags = db.difference(tags, query);
    // Testing type filtering

    return weights(filterTags(tags));
  };

  self.setSearchString = function(word){
    word = word.toLowerCase();
    self.searchString = word;
    self.trigger("typechange");
  };

  self.setTypeMode = function(type){
    self.typeMode = type;
    self.trigger("typechange");
  };

  self.getTypeMode = function(){
    if(!self.typeMode) return "all";
    return self.typeMode;
  };

  self.initEditTagsForSelection = function(){
    if(detailMode) 
      editTags = db.getCommonTags([imagesInView[iterator]]);
    else
      editTags = db.getCommonTags(selection, "intersection");
    //return editTags;
  };

  self.getEditTags = function(){
    return editTags;
  };

  self.getTagCloudForSelection = function(){
     var tags = db.getCommonTags();
     return weights(filterTags(db.difference(tags, editTags)));
  };

  self.getQueryTags = function(){
    return query;
  };


  self.renameTag = function(oldTag, newTag){
    db.rename(oldTag, newTag);
    self.trigger("change");
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

  self.activateEditMode = function(){
    editMode = true;
    console.log("edit on");
    self.initEditTagsForSelection();
    self.trigger("modechange");
  };

  self.deactivateEditMode = function(){
    editMode = false;
    self.trigger("modechange");
  };

  self.isEditMode = function(){
    return editMode;
  };

  self.deactivateDetailMode = function(){
    detailMode = false;
    //self.trigger("modechange");
  };

  self.isDetailMode = function(){
    return detailMode;
  };

  /* immediately saving changes */
  self.saveTag = function(tag) {
    var tag = tag.toLocaleLowerCase().valueOf();
    if(detailMode) {
      db.addTag(tag, [imagesInView[iterator]]);
      //db.addImage(imagesInView[iterator], [tag]);
    } 
    else db.addTag(tag, selection);
    self.searchString = "";
    console.log('TAG: ' + tag);
    console.log('EDITTAGS: ' + editTags);
    //editTags.push(tag);
    console.log('EDITTAGS: ' + editTags);
    self.trigger('editchange');
  };

  self.removeTag = function(tag) {
    var tag = tag.toLowerCase();
    if(detailMode) db.removeTags(imagesInView[iterator], [tag]);
    else {
      selection.forEach(function(image) {
        db.removeTags(image, [tag]);
      });
    } 
    editTags.splice(editTags.indexOf(tag), 1);
    self.trigger('editchange');
  }

  self.saveChanges = function(){
    selection.forEach(function(image){
      db.addImage(image, editTags);
      db.removeTags(image, removeTags);
    });

    // after saving selection should be empty
    self.deselectAll();
    self.toggleEditMode();
    self.trigger("change");
  };

  self.changeTagType = function(tag, type){
    db.changeTagType(tag, type);
    self.trigger("change");
  };


  self.addTagToEdit = function(tag){
    editTags.push(tag.toLowerCase());
    self.searchString = "";
    self.trigger("editchange");
  };

  self.removeTagFromEdit = function(tag){
    editTags.splice(editTags.indexOf(tag), 1);
    removeTags.push(tag);
    self.trigger("editchange");
  };

  self.addTagToQuery = function(tag){
    query.push(tag.toLowerCase());
    self.searchString = "";
    self.trigger("querychange");
  };

  self.addTagsToQuery = function(tags){
    query = [];
    tags.forEach(function(tag){
      query.push(tag.toLowerCase());
    });
    self.searchString = "";
    self.trigger("querychange");
  };

  self.removeTagFromQuery = function(tag){
    query.splice(query.indexOf(tag), 1);
    self.trigger("querychange");
  };

  self.resetQuery = function(){
    query = [];
    self.trigger("querychange");
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