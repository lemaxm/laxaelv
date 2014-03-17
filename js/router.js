function Router(){

    this.parse = function(path){
        if(!path){
            this.searchTags([]);
            return;
        }
        var method = path.split("?")[0];
        console.log(method);
        if(method==="search") this.parseSearch(path);
        if(method==="detail") this.parseDetail(path);
        if(method==="edit") this.parseEdit(path);
    };

    this.parseSearch = function(path){
        if(path.split("?").length<2){
            this.searchTags([]);
            return;
        }

        path.split("?").slice(1).forEach(function(element){
            kv = element.split("=");

            if(kv.length != 2){
                this.searchTags([]);
                return;
            }

            key = kv[0];
            values = kv[1].split(",");
            if(key==="q") this.searchTags(values);
            if(values.length===0) searchTags([]);
        }.bind(this));
    };

    this.parseEdit = function(path){
        console.log("edit history");
    };

    this.searchTags = function(values){
        //lax.deactivateEditMode();
        //lax.deactivateDetailMode();
        //lax.addTagsToQuery(values);
        lax.backToSearch(values);
    };


    this.parseDetail = function(path){
        var image = path.split("?")[1];
        lax.triggerDetails(image);
    };

    this.updateSearchURL = function(){
        var tags = lax.getQueryTags();
        path = "index.html#search";
        if(tags.length>0) path += "?q=";
        tags.forEach(function(tag){
            path += tag + ",";
        });
        if(tags.length>0) path = path.substring(0, path.length -1);
        $.route(path);
    };

    this.updateEditURL = function(){
        console.log("editurl");
        path = "index.html#edit";
        $.route(path);
    };

    this.updateDetailURL = function(){
        path = "index.html#detail?";
        path += lax.getDetailImage();
        $.route(path);
    };

    $.route(function(path) {
        path = path.split('#')[1];
        this.parse(path);
    }.bind(this));


    // Events

    lax.on("querychange", function(){
        this.updateSearchURL();
    }.bind(this));

    lax.on("modechange", function(){
        /*if(lax.isEditMode()) this.updateEditURL();*/
        if(lax.isDetailMode()) this.updateDetailURL();
        else this.updateSearchURL();
    }.bind(this));

    lax.on("detailchange", function(){
        this.updateDetailURL();
    }.bind(this));
}