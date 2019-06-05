class Rectangle extends Shape {
    constructor(x, y, width, height, className = "temp") {
        super('rect', {
            "x": x,
            "y": y, 
            "width": width, 
            "height": height, 
            "fill": "#ff54e8",
            "stroke": "#000000", 
            "stroke-width": 3
        });
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.domGroup = this.create();
        this.domElement = this.domGroup.querySelector('rect');
        this.nodes = [];
    }

    showNodes() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].changeStyles({
                "visibility": "visible"
            });
            this.nodes[i].domElement.addEventListener("mousedown", Rectangle.onMouseDownNode);
            this.nodes[i].domElement.addEventListener("mouseup", Rectangle.onMouseUpNode);
        }
    }

    hideNodes() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].changeStyles({
                "visibility": "hidden"
            });
            this.nodes[i].domElement.removeEventListener("mousedown", Rectangle.onMouseDownNode);
            this.nodes[i].domElement.removeEventListener("mouseup", Rectangle.onMouseUpNode);
        }
    }

    static onMouseClick(event) {
        if (canvas.clickToggle) {
            canvas.add(new Rectangle(100, 200, 100, 200));
            canvas.resetClickToggle(false);
            canvas.canvas.addEventListener("mousemove", Rectangle.onMouseMove);
        } else {
            canvas.resetClickToggle(true);
        }
    }

    static onMouseMove(event) {

    }

    static onMouseDownNode(event) {

    }

    static onMouseMoveNode(event) {

    }

    static onMouseUpNode(event) {

    }

    static removeEventListeners() {
        canvas.canvas.removeEventListener("click", Rectangle.onMouseClick);
        canvas.canvas.removeEventListener("mousemove", Rectangle.onMouseMove);
    }
}