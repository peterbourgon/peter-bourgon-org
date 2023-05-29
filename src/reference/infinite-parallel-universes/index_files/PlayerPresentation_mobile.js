function init() {
    SlideSynchronizer.render_slide(0);
    SlideSynchronizer.slideSyncStarted=false;
    try{
		for(var i=0;i<slides.length;i++) {
            if (/\.(jpg|png)$/i.test(slides[i])) {
                var imgLoader = $('<img style="display:none;" src="' + slides[i] + '" />');
                $('#imgPreload').append(imgLoader);
            }
		}
	}catch(exc){}
}

var SlideSynchronizer = {
    setTimes : function(t) {
    	this.TIMES = t;
	},
    start : function() {
    	if(this.slideSyncStarted==false){
	        this.player = this.getPlayer();
	        this.lastSlide = 0;
	    	setInterval("SlideSynchronizer.syncTask()", 500);	    	
	    	// not to start multiple times
	    	this.slideSyncStarted = true;
    	}
	},
    syncTask : function() {
        var ms = this.player.currentTime * 1000;
        $(window).trigger("player__playing", {
            'position_in_ms': ms || 0
        });
        try{
			var current_time = this.player.currentTime;
            for(var i=0;i<this.TIMES.length;i++) {
                if(this.TIMES[i] > current_time) {
                    if(this.lastSlide != (i-1)) {
                        this.lastSlide = i-1;
                        this.render_slide(this.lastSlide);
                    }
                    break;
                }
            }
        }catch (err){}
	},
    render_slide : function (index) {    	
    	var slide_path,
	        jpg_pattern;
	    slide_path = slides[index];
	    if (slide_path) {
	    	jpg_pattern = /\.(jpg|png)$/i;
	        // render slide only if image, all others will not work
	        if (jpg_pattern.test(slide_path)) {
	        	jQuery('#slideContainer').html('<div id="slide" style="visibility:visible;max-width:100%; max-height:100%;"><img style="max-height:100%;max-width:100%;" src="' + slide_path + '" rel="share"/></div>');
	        }
            else {
                swfobject.removeSWF("slide");
                jQuery('#slideContainer').html('<div id="slide"></div>');
                swfobject.embedSWF(slide_path, "slide",
                    "100%", "100%",
                    "10.0.0", "expressInstall.swf", null,
                    null);
                jQuery('#slideContainer').height(446);
            }
	    }    	
    },

    getPlayer : function () {
    	// in presentations/show.jsp SlideSynchronizer.playerId="video";
   		return document.getElementById(this.playerId);
	}	
};
