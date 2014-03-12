var TagFactory = {
	createTag:function(tagdata, parent) {
	    var tag = document.createElement('span');
	    tag.className = 'tag ' + tagdata.weight + ' ' + tagdata.type;
	    var label = document.createElement('span');
	    label.innerHTML = tagdata.tag;
	    var button = document.createElement('button');
	    button.className = 'x';
	    button.innerHTML = 'X';

	    tag.appendChild(label);
	    tag.appendChild(button);

	    parent.append(tag);

		return tag;
	},
	addToQueryListener:function(tag) {
	    tag.onclick = function(e) {
	        var tagtext = $(this).children().first().text();
	        lax.addTagToQuery(tagtext);
	    };
	},
	addToEditListener:function(tag) {
	    tag.onclick = function(e) {
	    	console.log('SAVE KLICK');
	    	e.stopImmediatePropagation();
	        var tagtext = $(this).children().first().text();
	        //lax.addTagToEdit(tagtext);
	        lax.saveTag(tagtext);
	    };
	},
	addRemoveFromQueryListener:function(tag) {
	    tag.lastChild.onclick = function(e) {
	        var tagtext = $(this).parent().children().first().text();
	        lax.removeTagFromQuery(tagtext);
	    };
	},
	addDeleteTagListener:function(tag) {
	    tag.lastChild.onclick = function(e) {
	        var tagtext = $(this).parent().children().first().text();
	        //lax.removeTagFromEdit(tagtext);
	        lax.removeTag(tagtext);
	    };
	},
	addSearchListener:function(tag) {
		tag.onclick = function(e) {
			var tagtext = $(this).text();
			tagtext = tagtext.slice(0, tagtext.length-1);
			lax.addTagsToQuery([tagtext]);
		};
	},
	addDraggabillity:function(tag) {
		$(tag).draggable({ stack: ".tag" });
	}
};