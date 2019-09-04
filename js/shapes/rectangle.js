class Rectangle extends Shape {
    constructor(canvas, attributes={"stroke": "black", "fill": "none", "stroke-width": "5px"}) {
        super(canvas, "rect", attributes);
        this.width = this.clickedCursorPositions[1].x - this.initialCursorPosition.x;
        this.height = this.clickedCursorPositions[1].y - this.initialCursorPosition.y;
        this.render();
    }
    
    render() {
        this.changeAttributes({
            "d": this._getPathString()
        });
    }

    updateClickedCursorPositions(newCursorPosition) {
        this.clickedCursorPositions[1] = newCursorPosition;
        this.width = this.clickedCursorPositions[1].x - this.initialCursorPosition.x;
        this.height = this.clickedCursorPositions[1].y - this.initialCursorPosition.y;
        this.render();
    }

    /* Private methods */
    _getPathString() {
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