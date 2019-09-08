/* All event listener callbacks go in this file */

/* --- RECTANGLE EVENT LISTENERS --- */
function onMouseClickRectangle() {
    const rect = this.canvas.currentShape;
    if (this.canvas.clicked) {
        this.canvas.add(new Rectangle(this.canvas));
        this.editEventListenerInvokeStatus("mousemove", true);
    } else {
        this.editEventListenerInvokeStatus("mousemove", false);
        rect.registerClick(this.canvas.getCursorPosition(event));
    }
}

function onMouseMoveRectangle(event) {
    const rect = this.canvas.currentShape;
    rect.registerClick(this.canvas.getCursorPosition(event));
}
/* --- END --- */

/* --- POLYGON EVENT LISTENERS ---*/
function onMouseClickPolygon(event) {
    if (this.canvas.clicked) {
        this.canvas.add(new Polygon(this.canvas));
        this.editEventListenerInvokeStatus("mousemove", true);
    } else {
        const polygon = this.canvas.currentShape;
        const currentClickPosition = this.canvas.getCursorPosition(event);
        const lastClickPosition = polygon.getLastClickPosition();

        if (currentClickPosition.equals(polygon.initialCursorPosition) || currentClickPosition.equals(lastClickPosition)) {
            polygon.nodes[polygon.nodes.length - 1].domElement.remove();
            polygon.nodes.pop();
            polygon.dParts.pop(polygon.dParts.length - 2);
            polygon.completeShape();
            this.editEventListenerInvokeStatus("mousemove", false);
        } else {
            polygon.registerClick(currentClickPosition);
        }
    }
}

function onMouseMovePolygon(event) {
    const polygon = this.canvas.currentShape;
    polygon.updateLastCursorPosition(this.canvas.getCursorPosition(event));
    polygon.render();
}
/* --- END ---*/
