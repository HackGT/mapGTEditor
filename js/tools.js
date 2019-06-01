let selectButton = document.getElementById("select");
let lineButton = document.getElementById("line");

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
        // refactor existing code
        this.shapes.push(shape);
        this.currentShape = shape;
        this.canvas.appendChild(shape.domGroup);
    }
}

/**
 * This class represents a Point on the webpage
 */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set x(x) {
        this._x = x;
    }

    set y(y) {
        this._y = y;
    }

    static add(p1, p2) {
        return new Point(p1.x + p2.x, p1.y + p2.y);
    }

    static subtract(p1, p2) {
        return new Point(p1.x - p2.x, p1.y - p2.y);
    }

    static divide(p, n) {
        return new Point(p.x / n, p.y / n);
    }

    static mod(p) {
        return Math.sqrt(p.x * p.x + p.y * p.y);
    }

    static midPoint(p1, p2) {
        return Point.divide((Point.add(p1,p2)), 2);
    }
}

/**
 * This class represents a Shape drawn on the Canvas
 */
class Shape {
    constructor(svgTag, attributes) {
        this.svgTag = svgTag;
        this.attributes = attributes;
        this.domGroup = this.create();
        this.nodes = [];
        this.selected = false;
    }

    create() {
        let group = document.createElementNS(svgns, 'g');
        group.classList.add("shape");
        return group;
    }

    addToCanvas(parent) {
        parent.appendChild(this.domGroup);
    }

    changeAttributes(attributes) {
        for (let attribute in attributes) {
            this.domElement.setAttributeNS(null, attribute, attributes[attribute]);
            this.attributes[attribute] = attributes[attribute];
        }
    }

    static onSelect(event) {
        let shapeId = parseInt(event.target.attributes.id.nodeValue);
        let shape = canvas.shapes[shapeId];

        if (!shape.selected) {
            shape.selected = true;
            canvas.shapes[shapeId].showNodes();
        } else {
            shape.selected = false;
            canvas.shapes[shapeId].hideNodes(); 
        }
        
    }
}

/**
 * This class represents the nodes of the Shape
 */
class Node extends Shape {
    constructor(c, r = 5, parentShape, parent = canvas) {
        super('circle', {
            "cx": c.x,
            "cy": c.y,
            "r": r,
            "fill": "#42b6f4",
            "stroke": "#000000",
            "stroke-width": 3,
            "id": 0
        });
        this.domGroup = this.create();
        this.domElement = this.domGroup.querySelector("circle");
        this.parentShape = parentShape;
        this.addToCanvas(parent);
    }

    create() {
        let node = document.createElementNS(svgns, 'circle');
        let nodeGroup = super.create();

        for (let attribute in this.attributes) {
            node.setAttributeNS(null, attribute, this.attributes[attribute]);
        }

        nodeGroup.appendChild(node);
        nodeGroup.classList.add("node");

        return nodeGroup;
    }
}

/**
 * This class represents the Path shape
 */
class Path extends Shape {
    constructor(moveTo, lineTo, className = "temp") {
        super('path', {
            "d": `M ${moveTo.x} ${moveTo.y} L ${lineTo.x} ${lineTo.y}`,
            "stroke": "#000000",
            "stroke-width": 3
        });
        this.moveTo = moveTo;
        this.lineTo = lineTo;
        this.domGroup = this.create();
        this.domElement = this.domGroup.querySelector('path');
        this.domGroup.classList.add(className);
    }

    create() {
        let path = document.createElementNS(svgns, 'path');
        let pathGroup = super.create();

        for (let attribute in this.attributes) {
            path.setAttributeNS(null, attribute, this.attributes[attribute]);
        }
        pathGroup.appendChild(path);
        pathGroup.classList.add("path");
        return pathGroup;
    }

    showNodes() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].domElement.style.visibility = 'visible';
            this.nodes[i].domElement.addEventListener("mousedown", Path.onMouseDownNode);
            this.nodes[i].domElement.addEventListener("mouseup", Path.onMouseUpNode);
        }
    }

    hideNodes() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].domElement.style.visibility = 'hidden';
            this.nodes[i].domElement.removeEventListener("mousedown", Path.onMouseDownNode);
            this.nodes[i].domElement.removeEventListener("mouseup", Path.onMouseUpNode);
        }
    }

    static onMouseClick(event) {
        if (canvas.clickToggle) {
            canvas.add(new Path(canvas.getCursorPosition(event), canvas.getCursorPosition(event)));
            canvas.resetClickToggle(false);
            canvas.canvas.addEventListener("mousemove", Path.onMouseMove);
        } else {
            canvas.currentShape.domGroup.classList.remove("temp");
            let shapeId = canvas.shapes.length - 1;
            canvas.currentShape.domElement.setAttributeNS(null, "id", canvas.shapes.length - 1);
            for (let i = 0; i < canvas.currentShape.nodes.length; i++) {
                canvas.currentShape.nodes[i].changeAttributes({
                    "id": `${shapeId}/${i}`
                });
                // pathObject.nodes[i].domElement.addEventListener("mousedown", Path.onMouseDownNode);
                // pathObject.nodes[i].domElement.addEventListener("mouseup", Path.onMouseUpNode);
                canvas.currentShape.nodes[i].domElement.style.visibility = "hidden";
            }
            canvas.canvas.removeEventListener("mousemove", Path.onMouseMove);
            canvas.resetClickToggle(true);
        }
    }

    static onMouseMove(event) {
        let pathObject = canvas.currentShape; 
        let currentCursor = canvas.getCursorPosition(event);
        pathObject.changeAttributes({
            "d": `M ${pathObject.moveTo.x} ${pathObject.moveTo.y} L ${currentCursor.x} ${currentCursor.y}`
        });
        pathObject.lineTo.x = currentCursor.x;
        pathObject.lineTo.y = currentCursor.y;

        let d = pathObject.attributes["d"];
        let lIndex = d.indexOf("L");
        let lineTo = d.slice(lIndex, d.length).split(" ").slice(1);

        let nodes = document.querySelectorAll(".temp .node");

        if (nodes.length > 1) {
            nodes[nodes.length - 1].remove();
            pathObject.nodes.pop();
        }
        pathObject.nodes.push(new Node(new Point(parseInt(lineTo[0]), parseInt(lineTo[1])), 5, canvas.currentShape, pathObject.domGroup));
    }

    static onMouseDownNode(event) {
        Path.removeEventListeners();
        event.target.classList.add("selected");
        canvas.canvas.addEventListener("mousemove", Path.onMouseMoveNode);
    }

    static onMouseMoveNode(event) {
        // change this code so that it triggers only for the shape that is selected
        let selectedNodeDOM = document.querySelector(".selected");
        let nodeId = selectedNodeDOM.attributes.id.nodeValue;
        let shapeId = parseInt(nodeId.slice(0, nodeId.indexOf("/")));
        let pathObject = canvas.shapes[shapeId];
        let currentCursor = canvas.getCursorPosition(event);
        let selectedNode = {};
        
        if (selectedNodeDOM.attributes.id.nodeValue == `${shapeId}/${0}`) {
            selectedNode = pathObject.nodes[0];
            pathObject.changeAttributes({
                "d": `M ${currentCursor.x} ${currentCursor.y} L ${pathObject.lineTo.x} ${pathObject.lineTo.y}`
            });
            pathObject.moveTo.x = currentCursor.x;
            pathObject.moveTo.y = currentCursor.y;
        } else {
            selectedNode = pathObject.nodes[1];
            pathObject.changeAttributes({
                "d": `M ${pathObject.moveTo.x} ${pathObject.moveTo.y} L ${currentCursor.x} ${currentCursor.y}`
            });
            pathObject.lineTo.x = currentCursor.x;
            pathObject.lineTo.y = currentCursor.y;
        }

        selectedNode.changeAttributes({
            "cx": currentCursor.x,
            "cy": currentCursor.y
        });
    }

    static onMouseUpNode(event) {
        // let nodeId = event.target.attributes.id.nodeValue;
        // let shapeId = parseInt(nodeId.slice(0, nodeId.indexOf("/")));
        // let pathObject = canvas.shapes[shapeId];
        // for (let i = 0; i < pathObject.nodes[i].length; i++) {
        //         pathObject.nodes[i].domElement.removeEventListener("mousedown", Path.onMouseDownNode);
        //         pathObject.nodes[i].domElement.removeEventListener("mouseup", Path.onMouseUpNode);
        // }
        let selectedNodeDOM = document.querySelector(".selected");
        selectedNodeDOM.classList.remove("selected");
        canvas.canvas.removeEventListener("mousemove", Path.onMouseMoveNode);
    }

    static removeEventListeners() {
        canvas.canvas.removeEventListener("click", Path.onMouseClick);
        canvas.canvas.removeEventListener("mousemove", Path.onMouseMove);
    }
}

const svgns = "http://www.w3.org/2000/svg";

let canvas = new Canvas("canvas", "canvas-container");

selectButton.addEventListener("click", () => {
    Path.removeEventListeners();
    for (let i = 0; i < canvas.shapes.length; i++) {
        canvas.shapes[i].domElement.addEventListener("click", Shape.onSelect);
    }
});

lineButton.addEventListener("click", () => {
    // refactor this
    canvas.clickToggle = true;
    for (let i = 0; i < canvas.shapes.length; i++) {
        let shape = canvas.shapes[i];
        shape.domElement.removeEventListener("click", Shape.onSelect);
        shape.hideNodes();
    }
    canvas.canvas.addEventListener("click", Path.onMouseClick);
});

