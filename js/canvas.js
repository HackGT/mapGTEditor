/**
 * This class represents the Canvas
 */
class Canvas {
    constructor(canvasId, canvasContainerId) {
        // svg canvas
        this.canvas = document.getElementById(canvasId);
        // container for the canvas to support accurate mouse click coordinates
        this.canvasContainer = document.getElementById(canvasContainerId);
        // list of shapes drawn on the canvas; shapes must be of class Shape
        this.shapes = [];  
        this.currentShape = null;
        this.clickToggle = false;
    }
    /**
     * Getter method for svgns URL to make svg shapes
     */
    static get svgns() {
        return "http://www.w3.org/2000/svg";
    }

    resetClickToggle(val) {
        this.clickToggle = val;
    }

    getCursorPosition(event) {
        let x = event.clientX - this.canvasContainer.offsetLeft;
        let y = event.clientY - this.canvasContainer.offsetTop;
        return new Point(x, y); 
    }

    add(shape) {
        this.shapes.push(shape);
        this.currentShape = shape;
        this.canvas.appendChild(shape.domGroup);
    }
}
