/* All event listener callbacks go in this file */

/* --- RECTANGLE EVENT LISTENERS --- */
function onMouseClickRectangle() {
    if (this.canvas.clicked) {
        this.canvas.add(new Rectangle(this.canvas));
        this.editEventListenerInvokeStatus("mousemove", true);
    } else {
        this.editEventListenerInvokeStatus("mousemove", false);
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

        // TODO: change this to clicking within a locality later
        if (currentClickPosition.equals(polygon.initialCursorPosition) || currentClickPosition.equals(lastClickPosition)) {
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

/* --- SELECT EVENT LISTENERS --- */
function onMouseClickSelect(event) {
    console.log("This listener is now active");
}
/* --- END --- */
