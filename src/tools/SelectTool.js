import { Tool } from './Tool';

export class SelectTool extends Tool {
    constructor(canvas) {
        super("select", canvas, [], "fas fa-mouse-pointer");
        this.domElement.addEventListener("click", this.onClickTool.bind(this)); // activating the click listener for the tool button
    }

    onClickTool() {
        this.canvas.setCurrentTool(this);
        const elementToAffect = this.canvas.currentView ? this.canvas.currentView: this.canvas.domElement;
        const image = this.canvas.domElement.getElementById(elementToAffect.attributes.id.nodeValue + "image");
        if (image) {
            elementToAffect.insertBefore(image, elementToAffect.firstChild);
        }
        this.canvas.shapes.forEach(shape => {
            if (shape.eventListeners.length === 0) {
                console.warn(`${shape} has not populated its eventListeners attribute. Read comments in Shape.js on how to do that`);
            } else {
                console.log(this.canvas.currentView);
                if (shape.view == this.canvas.domElement || shape.view == this.canvas.currentView) {
                    console.log("adding select listener");
                    const selectListeners = shape.eventListeners.filter(listener => listener.type === "select");
                    for (let listener of selectListeners) {
                        shape.domElement.addEventListener(listener.event, listener.callBack);
                        this.canvas.currentEventListeners.push({
                            event: listener.event,
                            callBack: listener.callBack
                        });
                    }   
                }
            }
        });
    }
}
