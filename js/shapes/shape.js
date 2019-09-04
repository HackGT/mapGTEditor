class Shape {
    /* NOTE: CURRENTLY DOESN'T SUPPORT MULTIPLE DOM ELEMENTS PER SHAPE */
    constructor(canvas, name, attributes={}, append=false) {
        this.canvas = canvas; // the canvas in which the shape is to be drawn
        this.name = name; // name of the shape
        this.domElement = document.createElementNS(svgns, 'path'); // dom of the shape; defaults to path since it is easier to write generic code
        this.domGroup = document.createElementNS(svgns, 'g'); // the group that the contains the parts of the shape
        
        this.domGroup.appendChild(this.domElement); // adds the dom element to the group

        this.attributes = attributes; // attributes of the shape dom element
        this.id = this.canvas.getNewId(); // assigns a unique id to the shape

        this.nodes = []; // set of all nodes that the shape has
        // nodes are used for resizing and editing the shape

        this.clickedCursorPositions = [this.canvas.getCursorPosition()]; // list containing all click locations when drawing the shape
        this.initialCursorPosition = this.clickedCursorPositions[0]; // the first click location when the shape was drawn

        // appends the shape to the canvas if true
        if (append) {
            this.canvas.domElement.appendChild(this.domGroup);
        }
    }

    // returns a list of current attributes of the path
    // not as comprehensive as what dev tools gives
    // basically returns only those attributes that you have edited or set at some point in your code
    get attributes() {
        return this._attributes;
    }

    // setter method for attributes
    set attributes(attributes) {
        for (let attribute in attributes) {
            this.domElement.setAttributeNS(null, attribute, attributes[attribute]);
        }
    }

    // the official and easy way to set attributes and styles to your shape
    changeAttributes(attributes) {
        this.attributes = attributes;
    }

    /* Methods that are shape specific */

    // renders the shape to the canvas
    render() {
        console.error("render() method needs to be implemented for this shape");
    }

    // used for registering a new click and updating the list of clicked positions
    // THIS FUNCTION SHOULD ONLY BE USED WHEN THE SHAPE IS BEING CREATED
    registerNewClick(newCursorPosition) {
        console.error("updateClickedCursorPositions() needs to be implemented for this shape");
    }
}
