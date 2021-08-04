// see: https://gist.github.com/yairEO/cb60592476a4204b27e83048949dbb45

var events = (function(){
    function addRemove(op, events, cb){
        if( cb )
            events.split(' ').forEach(name => {
                var ev = name.split('.')[0]
                cb = cb || this._eventsNS[name]

                this[op + 'EventListener'].call(this, ev, cb)

                if(op == 'add')   
                    this._eventsNS[name] = cb
                else
                    delete this._eventsNS[name]
            })
    }

    function on(events, cb){
        this._eventsNS = this._eventsNS || {} // save the _eventsNS on the DOM element itself
        addRemove.call(this, 'add', events, cb)
        return this
    }

    function off(events, cb){
        addRemove.call(this, 'remove', events, cb)
        return this
    }

    // need to work on this method, it is the hardest.
    // currently I do not know how to dispatch real events (with namespace) like UIEvent, KeyboardEvent, PointerEvent and so no
    function trigger(eventName, data){
        var e;

        // Don't do events on text and comment nodes
        if( elem.nodeType === 3 || elem.nodeType === 8 || !eventName ) return

        try {
            e = new CustomEvent(eventName)
        }
        catch(err){ console.warn(err) }
        this.dispatchEvent(e)
    }

    return { on, off, trigger }
})()

// Extend the DOM with these above custom methods
window.on = document.on = Element.prototype.on = events.on;
window.off = document.off = Element.prototype.off = events.off;
window.trigger = document.trigger = Element.prototype.trigger = events.trigger;