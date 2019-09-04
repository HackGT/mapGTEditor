class Polygon extends Shape {
    constructor(canvas, attributes={"stroke": "black", "fill": "none", "stroke-width": "5px"}) {
        super(canvas, "polygon", attributes);
        this.dParts = [
            {
                type: "M",
                values: [
                    this.initialCursorPosition.x,
                    this.initialCursorPosition.y
                ],
                node: this.canvas.createNode(new Point(this.initialCursorPosition.x, this.initialCursorPosition.y), this)
            },
            {
                type: "L",
                values: [
                    this.initialCursorPosition.x,
                    this.initialCursorPosition.y
                ],
                node: this.canvas.createNode(new Point(this.initialCursorPosition.x, this.initialCursorPosition.y), this)
            }
        ]; // abstraction to easily update and deal with d strings for the path :(

        this.eventListeners = [
            {   
                event: "click",
                type: "select",
                callBack: () => {console.log("I am selecting a shape in here")}
            }
        ]
        this.render();
    }

    render() {
        this.changeAttributes({
            "d": this._getD()
        });
        this.updateNodes();
    }

    registerClick(newCursorPosition) {
        this.dParts.push({
            type: "L",
            values: [
                newCursorPosition.x,
                newCursorPosition.y
            ],
            node: this.canvas.createNode(new Point(newCursorPosition.x, newCursorPosition.y), this)
        });
        this.clickedCursorPositions.push(newCursorPosition);
    }

    updateNodes() {
        for (let part of this.dParts) {
            // part.node can be null if the specific dPart does not require a node
            if (part.node) {
                part.node.updateLocation(new Point(part.values[0], part.values[1]));
            }
        }
    }

    // completes the polygon shape
    completeShape() {
        this.dParts.push({
            type: "Z",
            values: []
        });
        this.hideNodes();
        this.render();
    }

    /* --- helper methods --- */

    /* used in eventListeners.js */

    // updates the last two coordinates in the d string
    // mainly used for updating the UI
    updateLastCursorPosition(newCursorPosition) {
        const dPart = this.dParts[this.dParts.length - 1];
        dPart.values = [
            newCursorPosition.x,
            newCursorPosition.y
        ];
        dPart.node.updateLocation(new Point(newCursorPosition.x, newCursorPosition.y));
    }

    // used in eventListeners.js
    // returns the cursor position of the previous click
    getLastClickPosition() {
        const coordinates = this.dParts[this.dParts.length - 2].values;
        return new Point(coordinates[0], coordinates[1]);
    }

    /* --- END --- */

    /* Private methods */

    // returns a d string from dParts
    _getD() {
        let d = "";
        for (let o of this.dParts) {
            d += `${o.type} `;
            for (let value of o.values) {
                d+= `${value} `;
            }
        }
        return d;
    }
}