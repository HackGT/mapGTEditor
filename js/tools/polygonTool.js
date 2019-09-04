class PolygonTool extends Tool {
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
    }
}
