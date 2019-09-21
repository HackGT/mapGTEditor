import { Tool } from './Tool';
import { onMouseClickPolygon, onMouseMovePolygon } from '../eventListeners';

export class PolygonTool extends Tool {
    constructor(canvas) {
        super("polygon", canvas, [
            {
                "event": "click",
                "callBack": onMouseClickPolygon,
                "invoke": true
            },
            {
                "event": "mousemove",
                "callBack": onMouseMovePolygon,
                "invoke": false
            }
        ]);
        this.domElement.addEventListener("click", this.onClickTool.bind(this)); // activating the click listener for the tool button
    }
}
