class RectangleTool extends Tool {
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
    }
}
