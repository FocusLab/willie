// *****************************************
//      Utitlity Methods
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
//      Specs
// *****************************************

describe("Willie", function() {
    beforeEach(function() {
        // Clear cookies created
        eraseCookie("fl_actor_id");
    });

    it('exists', function() {
        expect(window.FocusLab).toBeDefined();
    });
    it('generates an actor id', function() {
        runs(function(){
            this.actorId = null;
            var spec = this;
            FocusLab("getActorId", {}).then(function(actorId){
                spec.actorId = actorId;
            },
            function(error){
                jasmine.log(error);
            });
        });
        waitsFor(function(){
            return this.actorId !== null;
        }, "Actor ID was never set");
        runs(function(){
            expect(this.actorId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
            expect(readCookie('fl_actor_id')).toEqual(this.actorId);
        });
    });
    it('sets and reuses an actor id cookie', function() {
        runs(function(){
            this.actorId = null;
            var spec = this;
            FocusLab("getActorId", {}).then(function(actorId){
                spec.actorId = actorId;
            },
            function(error){
                jasmine.log(error);
            });
        });
        waitsFor(function(){
            return this.actorId !== null;
        }, "Actor ID was never set");
        runs(function(){
            expect(this.actorId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
        });
        runs(function(){
            this.actorId2 = null;
            var spec = this;
            FocusLab("getActorId", {}).then(function(actorId){
                spec.actorId2 = actorId;
            },
            function(error){
                jasmine.log(error);
            });
        });
        waitsFor(function(){
            return this.actorId2 !== null;
        }, "Actor ID 2 was never set");
        runs(function(){
            expect(this.actorId2).toBe(this.actorId);
        });
    });

    it('Clears an actor id cookie', function() {
        runs(function(){
            this.actorId = null;
            var spec = this;
            FocusLab("getActorId", {}).then(function(actorId){
                spec.actorId = actorId;
            },
            function(error){
                jasmine.log(error);
            });
        });
        waitsFor(function(){
            return this.actorId !== null;
        }, "Actor ID was never set");
        runs(function(){
            expect(this.actorId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
            expect(readCookie('fl_actor_id')).toEqual(this.actorId);
        });
        runs(function(){
            FocusLab("resetTracking");
        });
        waitsFor(function(){
            return readCookie('fl_actor_id') === null;
        }, "Actor ID was never cleared");
        runs(function(){
            expect(readCookie('fl_actor_id')).toBeNull();
        });
    });

    it('Records a trigger', function() {
        var spec = this;
        FocusLab("recordTrigger", {
            success: function() {
                alert('success');
            },
            'trigger': {
                'action': 'view',
                'object': 'homepage'
            }
        }).then(function() {
            console.log('sucesss');
        }, function(error) {
            console.log('error');
            console.log(error);
        });
    });
});
