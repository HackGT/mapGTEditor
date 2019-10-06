import { Canvas } from "./canvas/Canvas";
import { SelectTool } from "./tools/SelectTool";
import { RectangleTool } from "./tools/RectangleTool";
import { PolygonTool } from "./tools/PolygonTool";
import { UploadTool } from "./tools/UploadTool";
import { ExportTool } from "./tools/ExportTool";
// import { Tool } from "./tools/Tool";

window.onload = () => {
    const canvas = new Canvas(1100, 600);
    const tools = {
        "select": new SelectTool(canvas),
        "rectangle": new RectangleTool(canvas),
        "polygon": new PolygonTool(canvas),
        "upload": new UploadTool(canvas),
        "export": new ExportTool(canvas),
    }
}
