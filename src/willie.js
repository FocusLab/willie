window.lightningjs||function(f,h){var d=f.lightningjs={modules:h.modules},n=h.modules;d.expensive=function(b){b._waitforload=!0;return b};d.require=h.require;d.provide=function(b,k){function l(){var a=f.console;if(a&&a.error)try{a.error.apply(a,arguments)}catch(c){}else if(f.opera)try{f.opera.postError.apply(f.opera,arguments)}catch(i){}}function h(a){var c=a[0],i=a[1],b=i>0?o[i]:k,g=Array.prototype.slice.call(a[2]),f=g.shift();a=e._.fh[c]=e._.fh[c]||[];i=e._.eh[c]=e._.eh[c]||[];e._.ph[c]=e._.ph[c]||
[];var d,j;if(b){if(b=b[f])try{d=b.apply(b,g)}catch(m){j=m}else j=Error("unknown deferred method '"+f+"'"),l(j.toString());d&&(o[c]=d);if(j){for(;i.length;){c=i.shift();try{c(j)}catch(n){l(n)}}i.push=function(a){a(j)}}else{for(;a.length;){c=a.shift();try{c(d)}catch(p){l(p)}}a.push=function(a){a(d)}}}else l("cannot call deferred method '"+f+"' on 'undefined'")}function p(){for(var a=g.shift();a;){var c;if(q)c=!1;else{var b=a[1];c=b>0?o[b]:k;var d=Array.prototype.slice.call(a[2]).shift(),e=void 0;b=
r[b]?!0:!1;c=c?(e=c[d])?e._waitforload?!0:!1:!1:b?!0:!1}c?(r[a[0]]=!0,m.push(a)):h(a);a=g.shift()}}d.require(b);var e=n[b];if(e.provided)l("deferred module '"+b+"' is already defined");else{e.provided=!0;var g=(e._.s||[]).slice(),o={0:k},m=[],r={},q=!1;g&&g[0]&&(o[g[0][1]]=k);k._load=function(){q=!0;for(var a=m.shift();a;)h(a),a=m.shift()};e._.s={push:function(a){g.push(a);p()}};p()}};n.lightningjs.provided||d.provide("lightningjs",{load:function(){var b=h.modules,d,f;for(f in b)d=b[f],d._&&d("_load")}})}(window,
window.parent.lightningjs);


var FocusLab = (function() {
    // Export Object
    var fl = {};

    // *****************************************
    //      Private Methods
    // *****************************************
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


    // *****************************************
    //      Public Attributes
    // *****************************************
    fl.cookieName = 'fl_actor_id';

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
    }

    // Always return the export object
    return fl;
}());


// *****************************************
//      LightningJS Hooks
// *****************************************
lightningjs.provide("FocusLab", {
    getActorId: function(options) {
        return FocusLab.getActorId(options);
   },
   resetTracking: function(options) {
        return FocusLab.resetTracking();
   }
});

