var FlashDetect={
	detect : function(){
		this.flashinstalled = 0;
		this.flashversion = 0;

		if (navigator.plugins && navigator.plugins.length)
		{
			this.x = navigator.plugins["Shockwave Flash"];
			if (this.x)
			{
				this.flashinstalled = 2;
				if (this.x.description)
				{
					this.y = this.x.description;
					this.cursor = this.y.indexOf(".")-1;
					this.flashversion="";
					while(this.isDigit(this.y.charAt(this.cursor))){
					    this.flashversion=this.y.charAt(this.cursor)+this.flashversion;
					    this.cursor--;
					}
				}
			}
			else
				this.flashinstalled = 1;
			if (navigator.plugins["Shockwave Flash 2.0"])
			{
				this.flashinstalled = 2;
				this.flashversion = 2;
			}
		}
		else if (navigator.mimeTypes && navigator.mimeTypes.length)
		{
			this.x = navigator.mimeTypes['application/x-shockwave-flash'];
			if (this.x && this.x.enabledPlugin)
				this.flashinstalled = 2;
			else
				this.flashinstalled = 1;
		}else{
			// IE flash detection.
			this.flashversion = 0;
			for(var i=10; i>0; i--){
				try{
					var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
					this.flashversion = i;
					this.flashinstalled = 2;
					break;
				}
				catch(e){
				}
			}
	   }
	},
	
	check : function(minVersion, divName, messageInvalidVersion, messageNotInstalled){
		this.detect();
		if(this.flashinstalled == 2){
			if(this.flashversion < minVersion){
				this.messageDiv = document.getElementById(divName);
				if(this.messageDiv){
					this.messageDiv.innerHTML = messageInvalidVersion;
				}
			}
		}else{
				this.messageDiv = document.getElementById(divName);
				if(this.messageDiv){
					this.messageDiv.innerHTML = messageNotInstalled;
				}
		}
	},
	isDigit : function(num) {
		if (num.length>1){return false;}
		this.string="1234567890";
		if (this.string.indexOf(num)!=-1){return true;}
		return false;
	}
}
var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

};
var P = { // Video Player

    authC1 : 'Q2xvdWRGcm9udC1Qb2xpY3k=',
    authC2 : 'Q2xvdWRGcm9udC1TaWduYXR1cmU=',
    authC3 : 'Q2xvdWRGcm9udC1LZXktUGFpci1JZA==',
    fc1 : '',
    fc2 : '',
    fc3 : '',
    everPlayed : false,
    mobile : false,
    canCleanAuth : true,
    biggestTimestamp : 0,
    s : '', // source for the video; set from corresponding pages

    canPlayHTML5 : function() {
        var canPlayHTML5 = false;
        var v = document.getElementById('video');
        if(v != null && v.canPlayType && v.canPlayType('video/mp4').replace(/no/, '')) {
            canPlayHTML5 = true;
        }
        return canPlayHTML5;
    },

    setPlayerSplash : function(isWideScreen, splash16_9, splash4_3) {
        if(P.canPlayHTML5()) {
            var theSplash = splash16_9;
            if(!isWideScreen) {
                theSplash = splash4_3;
            }
            if($("#video").length > 0) {
                document.getElementById("video").poster = theSplash;
            }
        }
    },

    adjustSpeed : function(speed, element) {
        var vid = document.getElementById("video");
        vid.playbackRate = speed;
        $('.presentation_speed button').removeClass('active');
        $(element).addClass('active');
    },

    fallbackFlashPlayerInterview : function() {
        if(this.everPlayed) return;
        $('#video').hide();
        if(P.canPlayHTML5()) {
            initFlashPlayerInterview();
        }
    },

    fallbackFlashPlayerPresentation : function () {
        if(this.everPlayed) return;
        $('#video').hide();
        $('#presentation_speed').hide();
        if(P.canPlayHTML5()) {
            initFlashPlayerPresentation();
        }
    },

    auth : function() {
        //auth
        P.canCleanAuth = false;
        CookieManager.createCookie(P.fc2, InfoQConstants.scs, InfoQConstants.sct*1000, InfoQConstants.scd);
        CookieManager.createCookie(P.fc1, InfoQConstants.scp, InfoQConstants.sct*1000, InfoQConstants.scd);
        CookieManager.createCookie(P.fc3, InfoQConstants.sck, InfoQConstants.sct*1000, InfoQConstants.scd);
    },

    cleanAuth : function(player, force) {
        P.canCleanAuth = true;
        //setTimeout(function() {P.cleanAuthData();}, 1000);
        if(force) {
            setTimeout(function() {P.cleanAuthData();}, 1000);
            //P.cleanAuthData();
            return;
        }
        if(P.biggestTimestamp < player.currentTime) {
            if((player.readyState == 4) && (!player.seeking)) {
                P.cleanAuthData();
            }
            else {
                P.auth();
            }
        }
        else {
            P.auth();
        }
        if(P.biggestTimestamp < player.currentTime) {
            P.biggestTimestamp = player.currentTime;
        }
    },

    cleanAuthData : function() {
        if((P.canCleanAuth) && (!P.mobile)) {
            CookieManager.createCookie(P.fc2, "", -1, InfoQConstants.scd);
        }
    },

    error : function(e, pageType) {
        if(e.target.error !== undefined) {
            switch (e.target.error.code) {
                case e.target.error.MEDIA_ERR_ABORTED:
                    //You aborted the video playback.
                    break;
                case e.target.error.MEDIA_ERR_NETWORK:
                    //A network error caused the video download to fail part-way.
                    break;
                case e.target.error.MEDIA_ERR_DECODE:
                    //The video playback was aborted due to a corruption problem or because the video used features your browser did not support.
    /*                if(pageType == 'i') {
                        P.fallbackFlashPlayerInterview();
                    }
                    else {
                        P.fallbackFlashPlayerPresentation();
                    }*/
                    P.auth();
                    $('#video').attr('src', P.s);
                    document.getElementById('video').play();
                    break;
                case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    //The video could not be loaded, either because the server or network failed or because the format is not supported.
                    if(pageType == 'i') {
                        P.fallbackFlashPlayerInterview();
                    }
                    else {
                        P.fallbackFlashPlayerPresentation();
                    }
                    break;
                default:
                    //An unknown error occurred.
                    break;
            }
        }
    },

    c : function (mobile, pageType, isWideScreen, splash16_9, splash4_3) {
        P.fc1 = Base64.decode(P.authC1);
        P.fc2 = Base64.decode(P.authC2);
        P.fc3 = Base64.decode(P.authC3);
        // control function; handling auth and splash screen
        P.auth();
        if(splash16_9 != null && splash4_3 != null) {
            P.setPlayerSplash(isWideScreen, splash16_9, splash4_3);
        }
        P.mobile = mobile;
        $('#video').attr('src', P.s);
        $('#video').on('loadeddata', function () {
            //P.cleanAuth(this, true);
        }).on('canplay', function () {
            //P.cleanAuth();
        }).on('timeupdate', function (e) {
            P.everPlayed = true;
            P.lastTimestamp = this.currentTime;
            //P.cleanAuth(this, false);
        }).on('progress', function (e) {
        }).on('playing', function (e) {
            P.everPlayed = true;
            //P.cleanAuth(this, false);
        }).on('error', function (e) {
            P.error(e, pageType);
        }).on('stalled', function (e) {
            //P.auth();
        }).on('click', function (e) {
            //P.auth();
        }).on('play', function (e) {
            //P.auth();
        }).on('pause', function (e) {
            //P.auth();
        }).on('seeking', function (e) {
            //P.auth();
        });
        $('#video').bind('contextmenu',function() { return false; });
    },

    seekPlayerTime : function(time, autoStartOnLoad) {
        //We accept both 00:10:32 or 00h10m32s
        if(time.includes("s")) {
            time=time.replace("s", "");
            time=time.replace("m", ":");
            time=time.replace("h", ":");
        }
        var timeInSeconds = CommonUtils.hmsToSeconds(time);
        if(!P.canPlayHTML5()) {
            var svm_player = swfobject.getObjectById('player');
            if (svm_player) {
                try {
                    svm_player.seek(timeInSeconds * 1000);
                } catch (exc) { console.log("Cannot skip to Flash video position"); }
            }
        }
        else {
            try {
                var player = $('#video').get(0);
                player.currentTime = timeInSeconds;
                    if (autoStartOnLoad) {
                        //we can't start playing on page load unless the video is muted
                        player.muted = true;
                    }
                    var promise = player.play();
                    if (promise !== undefined) {
                        promise.then(function(_){ /*Autoplay started!*/ });
                    }
            } catch (exc) { console.log("Cannot skip to HTML5 video position. ", exc); }
        }
    }
};

var InterviewPlayer = {
    goToTime : function(index) {
        if(!P.canPlayHTML5()) {
            goToTime(index);
        }
        else {
            P.auth();
            QuestionSynchronizer.goToTime(index);
        }
    }
};// init defaults
var presentationVideoPlayerWidth='100%';
var presentationVideoPlayerHeight='100%';

$(function () {
    if(!P.canPlayHTML5()) {
        initFlashPlayerPresentation();
    }
	// preload all images
	try{
		for(var i=0;i<slides.length;i++) {
			var imgLoader = $('<img style="display:none;" src="' + slides[i] + '" />');
			$('#imgPreload').append(imgLoader);
		}
	}catch(exc){}
});

function initFlashPlayerPresentation() {
    SVMPlayer.init({
        container_id: 'player',
        swf_width: presentationVideoPlayerWidth,
        swf_height: presentationVideoPlayerHeight,
        c3dmX3NlcnZlcg: vhf,
        c3dmX3ZpZGVvZmlsZQ: jsclassref,
        swf_image_url: playerSplash,
        swf_cue_points_in_s: TIMES,
        xiswf_url: EXPRESSINSTALL_SWF
    });

    // The Slides Component
    SVMPlayerSlideProjector.init({
        container_id: 'slide',
        slide_links: slides,
        first_slide_on_load: true,
        xiswf_url: EXPRESSINSTALL_SWF
    });
}
var SVMPlayer = {
    _cue_points: undefined,
    _opts: undefined,
    _swf_obj: undefined,

    defaults: {
        container_id: 'svmplayer',
        swf_server: undefined,
        c3dmX3NlcnZlcg: undefined,
        swf_streams: undefined,
        c3dmX3N0cmVhbXM: undefined,
        swf_videofile: undefined,
        c3dmX3ZpZGVvZmlsZQ: undefined,
        swf_url: SVMPLAYER_SWF,
        swf_width: "100%",
        swf_height: "100%",
        swf_version: '10.0.0',
        xiswf_url: 'expressInstall.swf',
        swf_params: { 
            'allowscriptaccess': 'always',
            'allowfullscreen': 'true',
            'wmode': 'opaque'
        },
        swf_image_url: undefined,
        swf_cue_points_in_s: [],
        swf_cue_points_in_ms: [],
        swf_subtitle_srt_url: undefined,
        swf_poll_interval: 333,
        on_initialized: undefined 
    },

    init: function (options) {
        var protocol_domain_match,
            flv_pattern;

        this._check_requirements();
        this._opts = jQuery.extend({}, this.defaults, options);

        if (!this._opts.swf_server && this._opts.c3dmX3NlcnZlcg) {
            this._opts.swf_server = Base64.decode(this._opts.c3dmX3NlcnZlcg);
        }
        if (!this._opts.swf_streams && this._opts.c3dmX3N0cmVhbXM) {
            this._opts.swf_streams = Base64.decode(this._opts.c3dmX3N0cmVhbXM);
        }
        if (!this._opts.swf_videofile && this._opts.c3dmX3ZpZGVvZmlsZQ) {
            this._opts.swf_videofile = Base64.decode(this._opts.c3dmX3ZpZGVvZmlsZQ);
        }

        this._cue_points = jQuery
            .merge(
                this._opts.swf_cue_points_in_ms, 
                jQuery.map(
                    this._opts.swf_cue_points_in_s,
                    function (value, i) {
                        return value * 1000;
                    }
                )
            )
            .sort(
                function (a, b) {
                    return a - b;
                }
            );

        if (!this._opts.swf_streams && this._opts.swf_videofile) {
            // Remove any protocol and domain names first, leaving only the path information.
            protocol_domain_match = /^\w+:\/\/[a-zA-Z0-9\.]+\//.exec(this._opts.swf_videofile);
            if (protocol_domain_match) {
                this._opts.swf_videofile = this._opts.swf_videofile.slice(protocol_domain_match[0].length);
            }
            // Make path information a stream name, defaulting to mp4 files.
            flv_pattern = /\.flv$/;
            if (flv_pattern.test(this._opts.swf_videofile)) {
                this._opts.swf_streams = 'flv:' + this._opts.swf_videofile.slice(0, this._opts.swf_videofile.lastIndexOf('.flv')) + ',0';
            } else {
                this._opts.swf_streams = 'mp4:' + this._opts.swf_videofile + ',0';
            }
        }

        this._embed();
    },

    _check_requirements: function () {
        /*
        Raises exceptions if requirements are not met.
        */
        if (typeof swfobject !== 'object') {
            throw {
                name: 'TypeError',
                message: 'SVMPlayer requires SWFObject as `swfobject`'
            };
        }
        if (typeof jQuery !== 'function') {
            throw {
                name: 'TypeError',
                message: 'SVMPlayer requires jQuery as `jQuery`'
            };
        }
    },

    _embed: function () {
        /* Embeds the player in the DOM. */
        var flashvars;

        flashvars = {
            server: this._opts.swf_server,
            streams: this._opts.swf_streams
        };
        swfobject.embedSWF(this._opts.swf_url, this._opts.container_id,
            this._opts.swf_width, this._opts.swf_height, this._opts.swf_version,
            this._opts.xiswf_url, flashvars,
            this._opts.swf_params, null, this._on_embed_ready);
    },

    _on_embed_ready: function (e) {
        /* 
        Callback triggered by swfobject after embedding the swf object and
        before the player is ready.
        */
        var container_id,
            id;

        if (e.success) {
            container_id = e.ref.id;
            id = e.id;
        }
        jQuery.event.trigger("svmplayer__on_embed", {
            'container_id': container_id,
            'id': id,
            'success': e.success
        });
    },

    _on_player_ready: function () {
        /*
        Callback triggered by the flash component after the initialization
        ended and the JavaScript-API is ready to use.
        Also triggers the `on_initialized` callback with this object and the
        swf player object as arguments.
        */        
        jQuery.event.trigger("svmplayer__on_ready", {
            'container_id': this._opts.container_id
        });

        this._swf_obj = swfobject.getObjectById(this._opts.container_id);

        if (this._opts.swf_image_url) {
            this._swf_obj.splashImage(this._opts.swf_image_url);
        }

        this._swf_obj.cuePoints(this._cue_points.toString());

        if (this._opts.swf_subtitle_srt_url) {
            this._swf_obj.subtitle(this._opts.swf_subtitle_srt_url);
        }

        if (this._opts.on_initialized) {
            this._opts.on_initialized(this, this._swf_obj);
        }
    },

    _on_player_pause: function () {
        /*
        Callback triggered by the flash component after the stream got
        paused.
        */
        if (this._interval_id) {
            jQuery.event.trigger("svmplayer__on_pause", {
                'container_id': this._opts.container_id,
                'position_in_ms': this._swf_obj.position() || 0
            });
            window.clearInterval(this._interval_id);
            this._interval_id = null;
        }
    },

    _on_player_play: function () {
        /*
        Callback triggered by the flash component after the playback of the
        stream started.
        */
        if (!this._interval_id) {
            var that = this;
			jQuery.event.trigger("svmplayer__on_play", {
                'container_id': this._opts.container_id,
                'position_in_ms': this._swf_obj.position() || 0
            });
			this._interval_id = window.setInterval(function(){
				that._on_playing(that);
			}, this._opts.swf_poll_interval);
        }
    },

    _on_player_seek: function (position_in_ms) {
        /*
        Callback triggered by the flash component after the user requested
        to seek in the stream.
        */
        jQuery.event.trigger("svmplayer__on_seek", {
            'container_id': this._opts.container_id,
            'position_in_ms': Math.round(position_in_ms)
        });
        this._on_playing(this);
    },

    _on_player_completed: function () {
        /*
        Callback triggered by the flash component after the playback of the
        stream completed.
        */
        jQuery.event.trigger("svmplayer__on_completed", {
            'container_id': this._opts.container_id
        });
    },

    _on_playing: function (self) {
        /*
        Callback triggered while playing with a reference to the js object.
        */
        var cue_point_index,
            i,
            max,
            position = self._swf_obj.position() || undefined;

        for (i = 0, max = self._cue_points.length; i < max; i += 1) {
            if (self._cue_points[i] < position) {
                cue_point_index = i;
            } else {
                break;
            }
        }
        if (cue_point_index !== undefined) {
            if (self._last_cue_point_index !== cue_point_index) {
                jQuery.event.trigger("svmplayer__on_cue_point", {
                    'container_id': self._opts.container_id,
                    'cue_point_index': cue_point_index,
                    'cue_point_position_in_ms': self._cue_points[cue_point_index]
                });
            }
            self._last_cue_point_index = cue_point_index;
        }
        $(window).trigger("player__playing", {
            'position_in_ms': self._swf_obj.position() || 0
        });
    }
};


var SVMPlayerQuestionHighlighter = {
    /*
    Globals:
        Requires jQuery as `jQuery`
    */

    // Remember what the class will use as private attributes ...
    _cue_points: undefined,
    _opts: undefined,

    defaults : {
        cue_points_in_s: [],  // A list of cue points in seconds (gets merged with cue_points_in_ms)
        cue_points_in_ms: [],  // A list of cue points in milliseconds (gets merged with cue_points_in_ss)
        question_class: null
    },

    init: function (options) {
        this._opts = jQuery.extend({}, this.defaults, options);

        this._cue_points = jQuery
            .merge(
                this._opts.cue_points_in_ms,
                jQuery.map(
                    this._opts.cue_points_in_s,
                    function (value, i) {
                        return value * 1000;
                    }
                )
            )
            .sort(
                function (a, b) {
                    return a - b;
                }
            );

        if (this._opts.question_class) {
            var that;

            that = this;
            jQuery(document).bind('svmplayer__on_cue_point', function (e, data) {
                jQuery('.' + that._opts.question_class).each(function (index, element) {
                    if (index === data.cue_point_index) {
                        jQuery(element).addClass('selected');
                    } else {
                        jQuery(element).removeClass('selected');
                    }
                    
                });
            });
        }
    }
};


var SVMPlayerSlideProjector = {
    /*
    Globals:
        Requires jQuery as `jQuery`
        Requires swfobject as `swfobject`
    */

    // Remember what the class will use as private attributes ...
    _opts: undefined,

    defaults: {
        container_id: 'svmplayer_slide',
        first_slide_on_load: true,
        slide_links: [],
        width: "100%",
        height: "100%",
        swf_version: '8.0.0',
        swf_params: {   
            'wmode': 'transparent'
        },
        xiswf_url: 'expressInstall.swf'  // The URI of the express install swf
    },

    init: function (options) {
        /* 
        Checks the requirements, updates the options and initializes the
        event listener.
        */
        var that;

        this._check_requirements();
        this._opts = jQuery.extend({}, this.defaults, options);

        that = this;
        jQuery(document).bind('svmplayer__on_cue_point', function (e, data) {
            that._render_slide(data.cue_point_index);
        });

        if (this._opts.first_slide_on_load && this._opts.slide_links) {
            this._render_slide(0);
        }
    },

    _check_requirements: function () {
        /*
        Raises exceptions if requirements are not met.
        */
        if (typeof swfobject !== 'object') {
            throw {
                name: 'TypeError',
                message: 'SVMPlayer requires SWFObject as `swfobject`'
            };
        }
        if (typeof jQuery !== 'function') {
            throw {
                name: 'TypeError',
                message: 'SVMPlayer requires jQuery as `jQuery`'
            };
        }
    },

    _render_slide: function (index) {
        var slide_path,
            swf_pattern;

        slide_path = this._opts.slide_links[index];
        if (slide_path) {
            swf_pattern = /\.swf$/;
            if (swf_pattern.test(slide_path)) {
                this._replace_slide(slide_path);                
                if(jQuery('#slideContainer').height()==0){
                	// use this height only for initialize before other changes are done to the height(necessary only for swf)
                	jQuery('#slideContainer').height(446);
                }
            } else {
                jQuery('#' + this._opts.container_id).parent().html('<div id="slide" style="visibility:visible;"><img style="width: ' + this._opts.width + '; height: ' + this._opts.height + ';" src="' + slide_path + '" /></div>');
            }
        }
    },
    
    _replace_slide: function(slide_path){
    	// see : http://learnswfobject.com/advanced-topics/load-a-swf-using-javascript-onclick-event/ (to avoid mem leaks and performance problems: remove existing swf and then add new one when you replace swf)
		swfobject.removeSWF(this._opts.container_id);
    	jQuery('#slideContainer').html('<div id="slide"></div>');
    	swfobject.embedSWF(slide_path, this._opts.container_id,
                this._opts.width, this._opts.height,
                this._opts.swf_version, this._opts.xiswf_url, null,
                this._opts.swf_params);
    }
};
