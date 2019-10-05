import { Tool } from './Tool';

export class SelectTool extends Tool {
    constructor(canvas) {
        super("select", canvas, []);
        this.domElement.addEventListener("click", this.onClickTool.bind(this)); // activating the click listener for the tool button
    }

    onClickTool() {
        this.canvas.setCurrentTool(this);
        const image = this.canvas.domElement.getElementById("uploaded-image");
        this.canvas.domElement.insertBefore(image, this.canvas.domElement.firstChild);
        this.canvas.shapes.forEach(shape => {
            if (shape.eventListeners.length === 0) {
                console.warn(`${shape} has not populated its eventListeners attribute. Read comments in Shape.js on how to do that`);
            } else {
                const selectListeners = shape.eventListeners.filter(listener => listener.type === "select");
                for (let listener of selectListeners) {
                    shape.domElement.addEventListener(listener.event, listener.callBack);
                    this.canvas.currentEventListeners.push({
                        event: listener.event,
                        callBack: listener.callBack
                    })
                }
            }
        });
    }
}
