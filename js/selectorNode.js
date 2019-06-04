/**
 * This class represents the nodes of the Shape
 */
class Node extends Shape {
    constructor(c, r, parentShape, parent = canvas) {
        super('circle', {
            "cx": c.x,
            "cy": c.y,
            "r": r,
            "fill": "#42b6f4",
            "stroke": "#000000",
            "stroke-width": 3,
            "id": 0
        });
        this.domGroup = this.create("node");
        this.domElement = this.domGroup.querySelector("circle");
        this.parentShape = parentShape;
        this.addToCanvas(parent);
    }
}
