class Rectangle extends Shape {
    constructor(width, height) {
        super('rect', {
            "width": width, 
            "height": height, 
            "fill": "#ff5454", 
            "stroke": "#000000",
            "stroke-width": 3
        });
        this.domGroup = this.create();
        this.domElement = this.domGroup.querySelector('rect');
        canvas.canvas.appendChild(this.domElement);
    }

    showNodes() {
        
    }

    hideNodes() {
        
    }

    static onMouseClick(event) {

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

    }
}