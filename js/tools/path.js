/**
 * This class represents the Path shape
 */
class Path extends Shape {
    constructor(moveTo, lineTo, className = "temp") {
        super('path', {
            "d": `M ${moveTo.x} ${moveTo.y} L ${lineTo.x} ${lineTo.y}`,
            "stroke": "#000000",
            "stroke-width": Path.options.strokeSettings.thickness
        });
        this.moveTo = moveTo;
        this.lineTo = lineTo;
        this.domGroup = this.create();
        this.domElement = this.domGroup.querySelector('path');
        this.domGroup.classList.add(className);
        this.nodes = [];
    }

    showNodes() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].changeStyles({
                "visibility": "visible"
            });
            this.nodes[i].domElement.addEventListener("mousedown", Path.onMouseDownNode);
            this.nodes[i].domElement.addEventListener("mouseup", Path.onMouseUpNode);
            this.nodes[i].domElement.addEventListener("mouseenter", Path.onMouseEnterNode);
            this.nodes[i].domElement.addEventListener("mouseleave", Path.onMouseLeaveNode);
        }
    }

    hideNodes() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].changeStyles({
                "visibility": "hidden"
            });
            this.nodes[i].domElement.removeEventListener("mousedown", Path.onMouseDownNode);
            this.nodes[i].domElement.removeEventListener("mouseup", Path.onMouseUpNode);
            this.nodes[i].domElement.removeEventListener("mouseenter", Path.onMouseEnterNode);
            this.nodes[i].domElement.removeEventListener("mouseleave", Path.onMouseLeaveNode);
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
            canvas.currentShape.domElement.setAttributeNS(null, "id", shapeId);
            for (let i = 0; i < canvas.currentShape.nodes.length; i++) {
                canvas.currentShape.nodes[i].changeAttributes({
                    "id": `${shapeId}/${i}`
                });
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
        event.target.classList.add("selected");
        canvas.canvas.addEventListener("mousemove", Path.onMouseMoveNode);
    }

    static onMouseMoveNode(event) {
        let selectedNodeDOM = document.querySelector(".selected");
        let nodeId = selectedNodeDOM.attributes.id.nodeValue;
        let shapeId = parseInt(nodeId.slice(0, nodeId.indexOf("/")));
        let pathObject = canvas.shapes[shapeId];
        let currentCursor = canvas.getCursorPosition(event);
        let selectedNode = {};

        if (nodeId == `${shapeId}/${0}`) {
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
        let selectedNodeDOM = document.querySelector(".selected");
        selectedNodeDOM.classList.remove("selected");
        canvas.canvas.removeEventListener("mousemove", Path.onMouseMoveNode);
    }

    static onMouseEnterNode(event) {
        event.target.setAttributeNS(null, "r", 6);
        event.target.classList.add("active");
    }

    static onMouseLeaveNode(event) {
        event.target.setAttributeNS(null, "r", 5);
        event.target.classList.remove("active");
    }

    static removeEventListeners() {
        canvas.canvas.removeEventListener("click", Path.onMouseClick);
        canvas.canvas.removeEventListener("mousemove", Path.onMouseMove);
    }
}

Path.options = new ToolOption("stroke");