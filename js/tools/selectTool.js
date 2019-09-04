class SelectTool extends Tool {
    constructor(canvas, domElement) {
        super("select", canvas, domElement, [
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
