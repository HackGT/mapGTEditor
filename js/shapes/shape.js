class Shape {
    constructor(canvas, name, attributes={}, append=false) {
        this.canvas = canvas;
        this.name = name;
        this.domElement = document.createElementNS(svgns, 'path');
        this.domGroup = document.createElementNS(svgns, 'g');
        this.domGroup.appendChild(this.domElement);
        this.attributes = attributes;
        this.id = this.canvas.getNewId();
        this.nodes = [];
        this.clickedCursorPositions = [this.canvas.getCursorPosition(), this.canvas.getCursorPosition()];
        this.initialCursorPosition = this.clickedCursorPositions[0];
        if (append) {
            this.canvas.domElement.appendChild(this.domGroup);
        }
    }

    get attributes() {
        return this._attributes;
    }

    set attributes(attributes) {
        for (let attribute in attributes) {
            this.domElement.setAttributeNS(null, attribute, attributes[attribute]);
        }
    }

    changeAttributes(attributes) {
        this.attributes = attributes;
    }

    /* Methods that are shape specific */
    render() {
        console.error("render() method needs to be implemented for this shape");
    }

    // TODO: RENAME THIS FUNCTION
    updateClickedCursorPositions(newCursorPosition) {
        console.error("updateClickedCursorPositions() needs to be implemented for this shape");
    }
}
