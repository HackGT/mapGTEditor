export const svgns = "http://www.w3.org/2000/svg";

export class Floor {
    constructor(floorNum) {
        this.floorNum = floorNum;

        this.domElement = document.createElementNS(svgns, "g");
        this.domElement.setAttributeNS(null, "class", "view");
        this.domElement.setAttributeNS(null, "id", "floor-" + this.floorNum);

        this.nodesContainer = document.createElementNS(svgns, "g");
        this.nodesContainer.setAttributeNS(null, "id", "nodes");

        this.domElement.appendChild(this.nodesContainer);

        this.shapes = [];
    }

    setVisible(visible) {
        if (visible) {
            this.domElement.style.display = "initial";
        } else {
            this.domElement.style.display = "none";
        }
    }
}