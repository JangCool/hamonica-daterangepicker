export function show(element){
    if(element){
        element.style.display='block';
    }
}

export function hide(element){
    if(element){
        element.style.display='none';
    }
}

export function css(element) {
    var args = arguments;
    
    if(args.length == 2 && typeof args[1] == "object") { 
        for(var key in args[1]) {
            element.style[key] = args[1][key];
        }
    } else if(args.length == 2 && typeof args[1] == "string") {
        element.style[args[1]] = args[1];
    }
};

export  function matches(el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
};

export function getOffset(element) {

    if (!element.getClientRects().length) {
        return { top: 0, left: 0 };
    }

    let rect = element.getBoundingClientRect();

    let win = element.ownerDocument.defaultView;

    return {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
    };   
};