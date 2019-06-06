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
        }
    }

    hideNodes() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].changeStyles({
                "visibility": "hidden"
            });
            this.nodes[i].domElement.removeEventListener("mousedown", Polygon.onMouseDownNode);
            this.nodes[i].domElement.removeEventListener("mouseup", Polygon.onMouseUpNode);
        }
    }

    static onMouseClick(event) {
        if (canvas.clickToggle) {
            canvas.add(new Polygon(canvas.getCursorPosition(event), [canvas.getCursorPosition(event)]));
            canvas.resetClickToggle(false);
            canvas.canvas.addEventListener("mousemove", Polygon.onMouseMove);
        } else {
            
        }
    }

    static onMouseMove(event) {
        let polygonObject = canvas.currentShape;
        let currentCursor = canvas.getCursorPosition(event);
        let d = polygonObject.d;
        let lIndex = d.lastIndexOf("L");
        let dSlice = d.slice(0, lIndex);
        console.log(dSlice);
        dSlice += ` L ${currentCursor.x} ${currentCursor.y}`;
        polygonObject.changeAttributes({
            "d": dSlice
        });
    }

    static onMouseDownNode(event) {

    }

    static onMouseMoveNode(event) {

    }

    static onMouseUpNode(event) {

    }

    static removeEventListeners() {

    }

    static addNodes(shape) {

    }
}
