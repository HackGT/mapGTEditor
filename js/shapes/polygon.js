class Polygon extends Shape {
    constructor(canvas, attributes={"stroke": "black", "fill": "none", "stroke-width": "5px"}) {
        super(canvas, "polygon", attributes);
        this.dParts = [
            {
                type: "M",
                values: [
                    this.initialCursorPosition.x,
                    this.initialCursorPosition.y
                ]
            },
            {
                type: "L",
                values: [
                    this.initialCursorPosition.x,
                    this.initialCursorPosition.y
                ]
            }
        ]; // abstraction to easily update and deal with d strings for the path :(
        this.render();
    }

    render() {
        this.changeAttributes({
            "d": this._getD()
        });
    }

    registerNewClick(newCursorPosition) {
        this.dParts.push({
            type: "L",
            values: [
                newCursorPosition.x,
                newCursorPosition.y
            ]
        });
        this.clickedCursorPositions.push(newCursorPosition);
    }

    // completes the polygon shape
    completeShape() {
        console.log('completing shape')
        this.dParts.push({
            type: "Z",
            values: []
        });
        this.render();
    }

    /* --- helper methods --- */

    /* used in eventListeners.js */

    // updates the last two coordinates in the d string
    // mainly used for updating the UI
    updateLastCursorPosition(newCursorPosition) {
        this.dParts[this.dParts.length - 1] = {
            type: "L",
            values: [
                newCursorPosition.x,
                newCursorPosition.y
            ]
        }
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