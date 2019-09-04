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
        ];
        this.render();
    }


    render() {
        this.changeAttributes({
            "d": this._getD()
        });
    }

    updateClickedCursorPositions(newCursorPosition) {
        this.dParts.push({
            type: "L",
            values: [
                newCursorPosition.x,
                newCursorPosition.y
            ]
        })
    }

    updateLastCursorPosition(newCursorPosition) {
        this.dParts[this.dParts.length - 1] = {
            type: "L",
            values: [
                newCursorPosition.x,
                newCursorPosition.y
            ]
        }
    }

    getLastClickPosition() {
        const coordinates = this.dParts[this.dParts.length - 2].values;
        return new Point(coordinates[0], coordinates[1]);
    }

    completeShape() {
        console.log('completing shape')
        this.dParts.push({
            type: "Z",
            values: []
        });
        this.render();
    }

    /* Private methods */
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