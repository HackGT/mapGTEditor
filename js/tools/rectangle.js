class Rectangle extends Shape {
    constructor(x, y, width, height, className = "temp") {
        super('rect', {
            "x": x,
            "y": y,
            "width": width,
            "height": height,
            "fill": Rectangle.options.fill.color,
            "stroke": "#000000",
            "stroke-width": Rectangle.options.stroke.thickness
        });

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.domGroup = this.create();
        this.domElement = this.domGroup.querySelector('rect');
        this.nodes = [];
        this.pivot = new Point(x, y);
    }

    showNodes() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].changeStyles({
                "visibility": "visible"
            });
            this.nodes[i].domElement.addEventListener("mousedown", Rectangle.onMouseDownNode);
            this.nodes[i].domElement.addEventListener("mouseup", Rectangle.onMouseUpNode);
            this.nodes[i].domElement.addEventListener("mouseenter", Rectangle.onMouseEnterNode);
            this.nodes[i].domElement.addEventListener("mouseleave", Rectangle.onMouseLeaveNode);
        }
    }

    hideNodes() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].changeStyles({
                "visibility": "hidden"
            });
            this.nodes[i].domElement.removeEventListener("mousedown", Rectangle.onMouseDownNode);
            this.nodes[i].domElement.removeEventListener("mouseup", Rectangle.onMouseUpNode);
            this.nodes[i].domElement.removeEventListener("mouseenter", Rectangle.onMouseEnterNode);
            this.nodes[i].domElement.removeEventListener("mouseleave", Rectangle.onMouseLeaveNode);
        }
    }

    static onMouseClick(event) {
        if (canvas.clickToggle) {
            canvas.add(new Rectangle(canvas.getCursorPosition(event).x, canvas.getCursorPosition(event).y, 0, 0));
            canvas.resetClickToggle(false);
            canvas.canvas.addEventListener("mousemove", Rectangle.onMouseMove);
        } else {
            Rectangle.addNodes(canvas.currentShape);

            canvas.currentShape.domGroup.classList.remove("temp");
            let shapeId = canvas.shapes.length - 1;
            canvas.currentShape.domElement.setAttributeNS(null, "id", shapeId);
            for (let i = 0; i < canvas.currentShape.nodes.length; i++) {
                canvas.currentShape.nodes[i].changeAttributes({
                    "id": `${shapeId}/${i}`
                });
                canvas.currentShape.nodes[i].domElement.style.visibility = "hidden";
            }
            canvas.canvas.removeEventListener("mousemove", Rectangle.onMouseMove);
            canvas.resetClickToggle(true);
        }
    }

    static onMouseMove(event) {
        let rectObject = canvas.currentShape;
        let currentCursor = canvas.getCursorPosition(event);

        rectObject.width = currentCursor.x - rectObject.pivot.x;
        rectObject.height = currentCursor.y - rectObject.pivot.y;

        if (rectObject.width < 0) {
            rectObject.x = currentCursor.x;
            rectObject.width *= -1;
        }
        if (rectObject.height < 0) {
            rectObject.y = currentCursor.y;
            rectObject.height *= -1;
        }
        rectObject.changeAttributes({
            "x": rectObject.x,
            "y": rectObject.y,
            "width": rectObject.width,
            "height": rectObject.height
        });
    }

    static onMouseDownNode(event) {
        event.target.classList.add("selected");
        canvas.canvas.addEventListener("mousemove", Rectangle.onMouseMoveNode);
    }

    static onMouseMoveNode(event) {
        let selectedNodeDOM = document.querySelector(".selected");
        let nodeId = selectedNodeDOM.attributes.id.nodeValue;
        let shapeId = parseInt(nodeId.slice(0, nodeId.indexOf("/")));
        let rectObject = canvas.shapes[shapeId];
        let currentCursor = canvas.getCursorPosition(event);
        let selectedNode = {};
        let x = 0;
        let y = 0;
        let width = 0;
        let height = 0;

        switch(nodeId) {
            case `${shapeId}/${0}`: {
                selectedNode = rectObject.nodes[0];
                width = rectObject.width + rectObject.x - currentCursor.x;
                height = rectObject.height + rectObject.y - currentCursor.y;
                x = currentCursor.x
                y = currentCursor.y
                break;
            }
            case `${shapeId}/${1}`: {
                selectedNode = rectObject.nodes[1];
                width = currentCursor.x - rectObject.x;
                height = rectObject.height + rectObject.y - currentCursor.y;
                x = rectObject.x;
                y = currentCursor.y;
                break;
            }
            case `${shapeId}/${2}`: {
                selectedNode = rectObject.nodes[2];
                width = currentCursor.x - rectObject.x;
                height = currentCursor.y - rectObject.y;
                x = rectObject.x;
                y = rectObject.y;
                break;
            }
            case `${shapeId}/${3}`: {
                selectedNode = rectObject.nodes[3];
                width = rectObject.width + rectObject.x - currentCursor.x;
                height = currentCursor.y - rectObject.y;
                x = currentCursor.x;
                y = rectObject.y;
                break;
            }
            default: console.error("Invalid node ID for rectangle");
        }

        if (width > 0 & height > 0) {
            rectObject.changeAttributes({
                "x": x,
                "y": y,
                "width": width,
                "height": height
            });
        }

        Rectangle.addNodes(rectObject);
    }

    static onMouseUpNode(event) {
        let selectedNodeDOM = document.querySelector(".selected");
        selectedNodeDOM.classList.remove("selected");
        canvas.canvas.removeEventListener("mousemove", Rectangle.onMouseMoveNode);
    }

    static removeEventListeners() {
        canvas.canvas.removeEventListener("click", Rectangle.onMouseClick);
        canvas.canvas.removeEventListener("mousemove", Rectangle.onMouseMove);
    }

    static onMouseEnterNode(event) {
        event.target.setAttributeNS(null, "r", 6);
        event.target.classList.add("active");
    }

    static onMouseLeaveNode(event) {
        event.target.setAttributeNS(null, "r", 5);
        event.target.classList.remove("active");
    }

    static addNodes(shape) {
        let x = parseInt(shape.domElement.attributes.x.nodeValue);
        let y = parseInt(shape.domElement.attributes.y.nodeValue);
        let width = shape.width;
        let height = shape.height;
        let points = [
            new Point(x, y),
            new Point(x + width, y),
            new Point(x + width, y + height),
            new Point(x, y + height)
        ];

        if (shape.nodes.length != 0) {
            for (let i = 0; i < points.length; i++) {
                shape.nodes[i].changeAttributes({
                    "cx": points[i].x,
                    "cy": points[i].y,
                })
            }
        } else {
            for (let i = 0; i < points.length; i++) {
                shape.nodes.push(new Node(
                    points[i],
                    5,
                    shape,
                    shape.domGroup
                ));
            }
        }
    }
}

Rectangle.options = new ToolOption("fill", "stroke");