class Node {
    constructor(canvas, location, svgTag="circle", attributes={}) {

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
        this.id = this._getID(); // currently not being set in the svg tag
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
        this.domElement.setAttributeNS(null, "x", location.x);
        this.domElement.setAttributeNS(null, "y", location.y);
    }

    /* Private methods */
    _getID() {
        return 1;
    }
}
