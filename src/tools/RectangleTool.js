import { Tool } from './Tool';
import { onMouseClickRectangle, onMouseMoveRectangle } from '../eventListeners';

export class RectangleTool extends Tool {
    constructor(canvas) {
        super("rectangle", canvas, [
            {
                "event": "click",
                "callBack": onMouseClickRectangle,
                "invoke": true,
            },
            {
                "event": "mousemove",
                "callBack": onMouseMoveRectangle,
                "invoke": false,
            }
        ]);
        this.domElement.addEventListener("click", this.onClickTool.bind(this)); // activating the click listener for the tool button
    }
}
