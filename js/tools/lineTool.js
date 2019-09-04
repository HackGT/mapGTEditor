class LineTool extends Tool {
    constructor(canvas, domElement) {
        super("line", canvas, domElement, [
            {
                "event": "click",
                "callBack": stub
            },
            {
                "event": "mousemove",
                "callBack": stub
            }
        ]);
    }
}
