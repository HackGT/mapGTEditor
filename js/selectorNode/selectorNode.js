class Node {
    constructor(canvas, location, id, eventListeners, svgTag="circle", attributes={}) {

        /* TODOS: ADD EVENT LISTENERS */

        this.domElement = document.createElementNS(svgns, svgTag);

        // styling the node
        // STYLING THE NODE IS DONE ONLY ONCE; HENCE NO FUNCTIONALITY TO CHANGE IT
        for (let attribute in attributes) {
            this.domElement.setAttributeNS(null, attribute, attributes[attribute]);
        }

        this.canvas = canvas; // canvas of which the node is a part of
        this.location = location; // where the node is located
        
        // setting the location of the node
        this.domElement.setAttributeNS(null, "cx", this.location.x);
        this.domElement.setAttributeNS(null, "cy", this.location.y);

        this.canvas.nodesContainer.appendChild(this.domElement); // adding the node to the nodes container

        this.shapes = []; // list of shapes that the node is associated with
        this.connections = []; // list of other node connections

        this.eventListeners = [];

        // DEEP COPY OF THE EVENT LISTENER OBJECTS
        // if this is not done, multiple binding of functions takes place
        // result = sad 1ntEgr8 :(
        for (let i = 0; i < eventListeners.length; i++) {
            this.eventListeners.push({
                type: eventListeners[i].type,
                event: eventListeners[i].event,
                callBack: eventListeners[i].callBack,
                invoke: eventListeners[i].invoke
            });
        }

        for (let i = 0; i < this.eventListeners.length; i++) {
            this.eventListeners[i].callBack = this.eventListeners[i].callBack.bind(this);
        }

        this.id = id;
    }

    // displays the node
    show() {
        this.domElement.setAttributeNS(null, "visibility", "visible");
        // TODO: add event listeners
    }

    // hides the node
    hide() {
        this.domElement.setAttributeNS(null, "visibility", "hidden");
        // TODO: remove event listeners
    }

    // two-way connects the passed in node
    connectTo(node) {
        this.connections.push(node);
        node.connections.push(this);
    }

    updateLocation(location) {
        this.domElement.setAttributeNS(null, "cx", location.x);
        this.domElement.setAttributeNS(null, "cy", location.y);
    }

    editEventListenerInvokeStatus(event, invoke, element) {
        const els = this.eventListeners;

        for (let i = 0; i < els.length; i++) {
            if (els[i].event === event) {
                els[i].invoke = invoke;
                if (invoke) {
                    element.domElement.addEventListener(els[i].event, els[i].callBack);
                } else {
                    element.domElement.removeEventListener(els[i].event, els[i].callBack);
                }
            }
        }
    }
}
