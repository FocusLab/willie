var FocusLab = (function(fl) {
    // *****************************************
    //      Handle Default Settings
    // *****************************************
    var defaults = {
        cookieName: 'fl_actor_id',
        remoteBase: 'https://api.focuslab.io/cors/',
        triggerURI: 'https://api.focuslab.io/api/v1/trigger/',
        release_version:  'v1.0'
    };

    // *****************************************
    //      Private Methods
    // *****************************************
    function setDefaults(obj, defaults) {

        for (var key in defaults) {
            if (obj[key] === undefined) {
                obj[key] = defaults[key];
            }
        }
    }
    setDefaults(fl, defaults);

    function createCookie(name,value,days) {
        var expires = "";

        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        document.cookie = name+"="+value+expires+"; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        createCookie(name,"",-1);
    }

    function getXHR() {
        var xhr = new easyXDM.Rpc({
            remote: fl.remoteBase
        }, {
            remote: {
                request: {}
            }
        });

        return xhr;
    }

    // *****************************************
    //      Public Methods
    // *****************************************
    fl.generateActorId = (typeof(window.crypto) != 'undefined' &&
                        typeof(window.crypto.getRandomValues) != 'undefined') ?
        function() {
            // If we have a cryptographically secure PRNG, use that
            // http://stackoverflow.com/questions/6906916/collisions-when-generating-uuids-in-javascript
            var buf = new Uint16Array(8);
            window.crypto.getRandomValues(buf);
            var S4 = function(num) {
                var ret = num.toString(16);
                while(ret.length < 4){
                    ret = "0"+ret;
                }
                return ret;
            };
            return (S4(buf[0])+S4(buf[1])+"-"+S4(buf[2])+"-"+S4(buf[3])+"-"+S4(buf[4])+"-"+S4(buf[5])+S4(buf[6])+S4(buf[7]));
        }

        :

        function() {
            // Otherwise, just use Math.random
            // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        };

    fl.getActorId = function() {
        var actorId = readCookie(fl.cookieName);

        if (actorId === null) {
            actorId = fl.generateActorId();
            createCookie(fl.cookieName, actorId, 3650);
        }

        return actorId;
    };

    fl.resetTracking = function() {
        eraseCookie(fl.cookieName);
    };

    fl.recordTrigger = function(options) {
        var triggerDefaults = {
            captured_identities: {},
            captured_attributes: {}
        };
        var trigger = options['trigger'] || {};
        var variables = trigger['variables'] || {};
        var xhr = getXHR();

        setDefaults(trigger, triggerDefaults);

        variables['user_agent'] = window.parent.navigator.userAgent;

        trigger['actor_id'] = fl.getActorId();
        trigger['variables'] = variables;

        xhr.request({
            url: fl.triggerURI,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-FL-API-KEY': fl.APIKey
            },
            data: JSON.stringify(trigger)
        });
    };

    fl.getRelease = function(options) {
        return fl.release_version;
    };

    // Always return the export object
    return fl;
}(window.parent.FLOptions || {}));


// *****************************************
//      LightningJS Hooks
// *****************************************
lightningjs.provide("FocusLab", {
    getActorId: function(options) {
        return FocusLab.getActorId(options);
    },
    resetTracking: function(options) {
        return FocusLab.resetTracking();
    },
    recordTrigger: function(options) {
        return FocusLab.recordTrigger(options);
    },
    getRelease: function(options) {
        return FocusLab.getRelease();
    }
});

