window.onload = () => {
    const canvas = new Canvas(1000, 500);
    window.canvas = canvas;
    const tools = {
        "rectangle": new RectangleTool(canvas),
        "polygon": new PolygonTool(canvas)
    }
}
