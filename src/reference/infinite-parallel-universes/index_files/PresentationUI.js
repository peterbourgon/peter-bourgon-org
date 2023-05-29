/*globals $, setTimeout, i18nMinimize, i18nFullScreen*/
$(function () {
    'use strict';

// the presentation page has the following components
// - video container
       var $playerContainer = $('#playerContainer'),
// - slides container
        $slidesContainer = $('#slideContainer'),

// - demo is a special view that is meant to display the video in whole width, even if the slides need to be hidden.
//      the purpose of this mode is to allow the user to follow what's happening on the presenter's screen. A demo is a video screencast.
        inDemo = false,
// - the transition from presentation to demo and from demo to presentations are done in an animated transition, configured here:
        transitionTime = 2000, // milliseconds, default is for InfoQ player
        isHTML5Player = $('video#video').length > 0;

// START PROCESSING
    var deleteVideoPosterAttributeForIOSLowerThan4 = function () {
        // ios lower then 4 does not play video if both poster and source attributes are used.
        var ua = navigator.userAgent,
            uaindex,
            userOS,
            userOSver;
        // determine OS
        if (ua.match(/iPad/i) || ua.match(/iPhone/i)) {
            userOS = 'iOS';
            uaindex = ua.indexOf('OS ');
            if (uaindex !== -1) {
                userOSver = ua.substr(uaindex + 3, 3).replace('_', '.');
                if (userOSver < 4) {
                    $('#video').removeAttr("poster");
                }
            }
        }
    };

    deleteVideoPosterAttributeForIOSLowerThan4();

    // only bother if there are demos
    if (demoTimings) {
        var demoSwitches = demoTimings.split(',');
        for (var i = 0; i < demoSwitches.length; i++) {
            demoSwitches[i] = parseInt(demoSwitches[i]) * 1000; // translate to milliseconds
        }

        $(window).on('player__playing', function(evt, extra) {
            var idx = getLastSwitchIdx(extra.position_in_ms);
            if (idx % 2 === 0) {
                if (!inDemo) {
                    inDemo = true;
                    infoq.event.trigger('demoIn');
                }
            } else {
                if (inDemo) {
                    inDemo = false;
                    infoq.event.trigger('demoOut');
                }
            }
            return false; // for now the only consumer of the event.
        });
    }

    function getLastSwitchIdx(ms) {
        for (var i = 0; i < demoSwitches.length; i++) {
            var offset = 0; // transitioning from presentation to demo has to be started 2s before the demo starts, 
            //as it takes 2s for the animation to complete. At the moment it is completed, the demo should already be max size
            if (i % 2 === 0) {
                offset = transitionTime;
            }
            if (ms + offset <= demoSwitches[i]) {
                return i - 1;
            }
            if (i === demoSwitches.length) {
                return i;
            }
        }
    }

});

// for downloading mp3 and pdf
$(function () {
    infoq.event.on('download', function(e) {
        if(e.targetType=="mp3"){
            UserActions_Profile.forceUpdateProfile(PresentationDownloads.loadMp3);
        }
        if(e.targetType=="slides"){
            UserActions_Profile.forceUpdateProfile(PresentationDownloads.loadPdf);
        }
    });
});

var PresentationDownloads = {
    loadMp3: function() {
        // we might have a force update popup displayed here, close it first
        infoq.event.trigger("modalClose");
        $('#mp3Form').submit();
    },
    loadPdf: function() {
        // we might have a force update popup displayed here, close it first
        infoq.event.trigger("modalClose");
        $('#pdfForm').submit();
    }
};