class Rectangle extends Shape {
    constructor(canvas, attributes={"stroke": "black", "fill": "none", "stroke-width": "5px"}) {
        super(canvas, "rect", attributes);
        this.clickedCursorPositions = [this.initialCursorPosition, this.initialCursorPosition]; // setting this for rectangle specific implementation
        this.width = this.clickedCursorPositions[1].x - this.initialCursorPosition.x; // width of the rectangle
        this.height = this.clickedCursorPositions[1].y - this.initialCursorPosition.y; // height of the rectangle
        this.dParts = [
            {
                type: "M",
                values: [
                    this.initialCursorPosition.x,
                    this.initialCursorPosition.y
                ],
                node: this.canvas.createNode(new Point(this.initialCursorPosition.x, this.initialCursorPosition.y), this)
            }
        ];
        this.render();
    }
    
    render() {
        this.changeAttributes({
            "d": this._getD()
        });
    }

    registerClick(newCursorPosition) {
        this.clickedCursorPositions[1] = newCursorPosition;
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
                    newCursorPosition.x,
                    this.initialCursorPosition.y
                ],
                node: this.canvas.createNode(new Point(this.initialCursorPosition.x, this.initialCursorPosition.y), this)
            },
            {
                type: "L",
                values: [
                    newCursorPosition.x,
                    newCursorPosition.y
                ],
                node: this.canvas.createNode(new Point(this.initialCursorPosition.x, this.initialCursorPosition.y), this)
            },
            {
                type: "L",
                values: [
                    this.initialCursorPosition.x,
                    newCursorPosition.y
                ],
                node: this.canvas.createNode(new Point(this.initialCursorPosition.x, this.initialCursorPosition.y), this)
            }
        ]
        this.width = this.clickedCursorPositions[1].x - this.initialCursorPosition.x;
        this.height = this.clickedCursorPositions[1].y - this.initialCursorPosition.y;
        this.render();
    }

    updateNodes() {
        for (let part of this.dParts) {
            // part.node can be null if the specific dPart does not require a node
            if (part.node) {
                part.node.updateLocation(new Point(part.values[0], part.values[1]));
            }
        }
    }

    updateDParts(index, values) {
        if (index > this.dParts.length) {
            console.warn("Looks like you are doing some janky stuff with dParts. Please check your code!");
        } else {
            this.dParts[index].values = values;
            this.render();
        }
    }

    /* Private methods */

    // used to return a d string that looks like a rectangle :)
    _getD() {
        const moveTo = this.initialCursorPosition; 
        const lineTos = [
            Point.add(moveTo ,new Point(this.width, 0)),
            this.clickedCursorPositions[1],
            Point.add(moveTo ,new Point(0, this.height)),
            moveTo,
        ];

        let d = `M ${moveTo.x} ${moveTo.y} `;

        lineTos.forEach((lineTo) => {
            d += `L ${lineTo.x} ${lineTo.y} `;
        });
        
        return d;
    }
}