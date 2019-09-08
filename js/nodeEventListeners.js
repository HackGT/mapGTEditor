/* --- POLYGON --- */

function onMouseDownNodePolygon() {
    this.editEventListenerInvokeStatus("mousemove", true, this.canvas);
    this.editEventListenerInvokeStatus("mouseup", true, this.canvas);
}

function onMouseMoveNodePolygon() {
    const splitIds = this.id.split("/");
    // even indices -> shape number
    // odd indices -> node number
    for (let i = 0; i < splitIds.length - 1; i++) {
        const shapeId = splitIds[i];
        const dPartIndex = splitIds[i + 1];
        const shape = this.shapes.filter(shape => shape.id == shapeId)[0];
        const currentCursorPosition = this.canvas.getCursorPosition(event);
        shape.updateDParts(dPartIndex, [currentCursorPosition.x, currentCursorPosition.y]);
    }
}

function onMouseUpNodePolygon() {
    this.editEventListenerInvokeStatus("mousemove", false, this.canvas);
    this.editEventListenerInvokeStatus("mouseup", false, this.canvas);
}

/* --- END --- */