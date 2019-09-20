import { Canvas } from "./canvas/Canvas";
import { SelectTool } from "./tools/SelectTool";
import { RectangleTool } from "./tools/RectangleTool";
import { PolygonTool } from "./tools/PolygonTool";

window.onload = () => {
    const canvas = new Canvas(1000, 500);
    const tools = {
        "select": new SelectTool(canvas),
        "rectangle": new RectangleTool(canvas),
        "polygon": new PolygonTool(canvas)
    }
}
