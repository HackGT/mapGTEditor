const errorMessageForHandlers = "Implement functionality in child class";
/**
 * This class represents a Shape drawn on the Canvas
 */
class Shape {
    constructor(svgTag, attributes) {
        this.svgTag = svgTag;
        this.attributes = attributes;
        this.domGroup = this.create();
        this.selected = false;
    }

    create(className = this.svgTag) {
        let pathGroup = document.createElementNS(svgns, 'g');
        let path = document.createElementNS(svgns, this.svgTag);
        pathGroup.classList.add("shape");

        for (let attribute in this.attributes) {
            path.setAttributeNS(null, attribute, this.attributes[attribute]);
        }

        pathGroup.appendChild(path);
        pathGroup.classList.add(className);
        return pathGroup;
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

    changeStyles(styles) {
        let styleString = "";
        for (let style in styles) {
            styleString += `${style}: ${styles[style]}; `
        }
        this.changeAttributes({
            "style": styleString
        });
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

    static onMouseClick(event) {
        console.error(errorMessageForHandlers);
    }

    static onMouseMove(event) {
        console.error(errorMessageForHandlers);
    }

    static onMouseDownNode(event) {
        console.error(errorMessageForHandlers);
    }

    static onMouseMoveNode(event) {
        console.error(errorMessageForHandlers);
    }

    static onMouseUpNode(event) {
        console.error(errorMessageForHandlers);
    }
    
    static removeEventListeners() {
        console.error(errorMessageForHandlers);
    }
}
