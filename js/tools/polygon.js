class Polygon extends Shape {
    constructor(moveTo, lineToList, className = "temp") {
        super('path', {
            "d": `M ${moveTo.x} ${moveTo.y}`,
            "stroke": "#000000",
            "stroke-width": 3,
            "fill": "none"
        });
        this.moveTo = moveTo;
        this.lineToList = lineToList;
        this.domGroup = this.create();
        this.domElement = this.domGroup.querySelector('path');
        this.domGroup.classList.add(className);
        this.d = this.attributes["d"];
        this.nodes = [];

        for (let i = 0; i < lineToList.length; i++) {
            this.d += ` L ${lineToList[i].x} ${lineToList[i].y}`;
        }
        this.changeAttributes({
            "d": this.d
        });
    }

    showNodes() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].changeStyles({
                "visibility": "visible"
            });
            this.nodes[i].domElement.addEventListener("mousedown", Polygon.onMouseDownNode);
            this.nodes[i].domElement.addEventListener("mouseup", Polygon.onMouseUpNode);
            this.nodes[i].domElement.addEventListener("mouseenter", Polygon.onMouseEnterNode);
            this.nodes[i].domElement.addEventListener("mouseleave", Polygon.onMouseLeaveNode);
        }
    }

    hideNodes() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].changeStyles({
                "visibility": "hidden"
            });
            this.nodes[i].domElement.removeEventListener("mousedown", Polygon.onMouseDownNode);
            this.nodes[i].domElement.removeEventListener("mouseup", Polygon.onMouseUpNode);
            this.nodes[i].domElement.removeEventListener("mouseenter", Polygon.onMouseEnterNode);
            this.nodes[i].domElement.removeEventListener("mouseleave", Polygon.onMouseLeaveNode);
        }
    }

    generateDString(moveTo = this.moveTo) {
        let d = `M ${moveTo.x} ${moveTo.y}`;

        for (let i = 0; i < this.lineToList.length; i++) {
            d += ` L ${this.lineToList[i].x} ${this.lineToList[i].y}`;
        }

        return d;
    }

    generateLineToListFromString(lineToListString) {
        let lineToList = [];
        for (let i = 0; i < lineToListString.length; i++) {
            let point = lineToListString[i].split(" ");
            lineToList.push(new Point(parseInt(point[0]), parseInt(point[1])));
        }

        return lineToList;
    }

    static onMouseClick(event) {
        if (canvas.clickToggle) {
            canvas.add(new Polygon(canvas.getCursorPosition(event), [canvas.getCursorPosition(event)]));
            canvas.resetClickToggle(false);
            canvas.canvasContainer.addEventListener("mousemove", Polygon.onMouseMove);
            canvas.currentShape.nodes.push(new Node(
                canvas.getCursorPosition(event),
                5, canvas.currentShape,
                canvas.currentShape.domGroup
            ));
            canvas.currentShape.nodes[0].domElement.addEventListener("mouseenter", Polygon.onMouseEnterNode);
            canvas.currentShape.nodes[0].domElement.addEventListener("mouseleave", Polygon.onMouseLeaveNode);
        } else {
            let currentCursor = canvas.getCursorPosition(event);
            let polygonObject = canvas.currentShape;
            let moveToNodeDOM = polygonObject.nodes[0].domElement;
            let d = polygonObject.d;
            let lIndex = d.lastIndexOf("L");
            let dSlice = d.slice(0, lIndex);
            let lPoints = d.slice(d.indexOf("L ") + 2).split(" L ").reverse();

            if (moveToNodeDOM.classList.contains("active") || lPoints[0] == lPoints[1]) {
                dSlice += `L ${polygonObject.moveTo.x} ${polygonObject.moveTo.y}`;
                polygonObject.changeAttributes({
                    "d": dSlice
                });

                lPoints = dSlice.slice(d.indexOf("L ") + 2).split(" L ");
                polygonObject.lineToList = polygonObject.generateLineToListFromString(lPoints);
                polygonObject.domGroup.classList.remove("temp");

                let shapeId = canvas.shapes.length - 1;
                polygonObject.domElement.setAttributeNS(null, "id", shapeId);

                for (let i = 0; i < polygonObject.nodes.length; i++) {
                    polygonObject.nodes[i].changeAttributes({
                        "id": `${shapeId}/${i}`
                    });
                }
                canvas.canvasContainer.removeEventListener("mousemove", Polygon.onMouseMove);
                canvas.resetClickToggle(true);
                polygonObject.hideNodes();
            } else {
                d += ` L ${currentCursor.x} ${currentCursor.y}`;
                polygonObject.changeAttributes({
                    "d": d
                });
                polygonObject.nodes.push(new Node(
                    canvas.getCursorPosition(event),
                    5, polygonObject,
                    polygonObject.domGroup
                ));
                let i = polygonObject.nodes.length - 1;
                polygonObject.nodes[i].domElement.addEventListener("mouseenter", Polygon.onMouseEnterNode);
                polygonObject.nodes[i].domElement.addEventListener("mouseleave", Polygon.onMouseLeaveNode);
            }
        }
    }

    static onMouseMove(event) {
        let polygonObject = canvas.currentShape;
        let currentCursor = canvas.getCursorPosition(event);
        let d = polygonObject.d;
        let lIndex = d.lastIndexOf("L");
        let dSlice = d.slice(0, lIndex);
        dSlice += `L ${currentCursor.x} ${currentCursor.y}`;
        polygonObject.changeAttributes({
            "d": dSlice
        });
    }

    static onMouseDownNode(event) {
        event.target.classList.add("selected");
        canvas.canvasContainer.addEventListener("mousemove", Polygon.onMouseMoveNode);
    }

    static onMouseMoveNode(event) {
        let selectedNodeDOM = document.querySelector(".selected");
        let nodeId = selectedNodeDOM.attributes.id.nodeValue;
        let shapeId = parseInt(nodeId.slice(0, nodeId.indexOf("/")));
        let polygonObject = canvas.shapes[shapeId];
        let currentCursor = canvas.getCursorPosition(event);
        let selectedNode = {};

        if (nodeId == `${shapeId}/${0}`) {
            selectedNode = polygonObject.nodes[0];
            polygonObject.moveTo = currentCursor;
            polygonObject.lineToList[polygonObject.lineToList.length - 1] = new Point(currentCursor.x, currentCursor.y);
        } else {
            let nodeNumber = parseInt(nodeId.slice(nodeId.lastIndexOf("/") + 1));
            selectedNode = polygonObject.nodes[nodeNumber];
            polygonObject.lineToList[nodeNumber - 1] = new Point(currentCursor.x, currentCursor.y);
        }
        polygonObject.changeAttributes({
            "d": polygonObject.generateDString()
        });

        selectedNode.changeAttributes({
            "cx": currentCursor.x,
            "cy": currentCursor.y
        });
    }

    static onMouseUpNode(event) {
        let selectedNodeDOM = document.querySelector(".selected");
        selectedNodeDOM.classList.remove("selected");
        canvas.canvasContainer.removeEventListener("mousemove", Polygon.onMouseMoveNode);
    }

    static removeEventListeners() {
        canvas.canvasContainer.removeEventListener("click", Polygon.onMouseClick);
        canvas.canvasContainer.removeEventListener("mousemove", Polygon.onMouseMove);
    }

    static onMouseEnterNode(event) {
        event.target.setAttributeNS(null, "r", 6);
        event.target.classList.add("active");
    }

    static onMouseLeaveNode(event) {
        event.target.setAttributeNS(null, "r", 5);
        event.target.classList.remove("active");
    }
}
