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

    const updateShapeButton = document.getElementById("update-shape");
    updateShapeButton.disabled = true;

    const shapeIdInput = document.getElementById("shape-id"),
          shapeClassInput = document.getElementById("shape-class"),
          shapeFillInput = document.getElementById("shape-fill"),
          shapeStrokeWidthInput = document.getElementById("shape-stroke-width");

    [shapeIdInput, shapeClassInput, shapeFillInput, shapeStrokeWidthInput].forEach(element => {
        element.addEventListener("input", e => {
            updateShapeButton.disabled = false;
        })
    });

    updateShapeButton.addEventListener("click", e => {
        console.log(shapeIdInput.value);
        console.log(shapeClassInput.value);
        console.log("updated");
        var currentShape = canvas.currentShape;
        
        if (shapeIdInput.value) {
            currentShape.domGroup.id = shapeIdInput.value;
        }
        
        if (shapeClassInput.value) {
            currentShape.domGroup.className.baseVal = shapeClassInput.value;
        }

        console.log(currentShape.domElement);

        if (shapeFillInput.value) {
            currentShape.domElement.style.fill = shapeFillInput.value;
        }

        if (shapeStrokeWidthInput.value) {
            currentShape.domElement.style.strokeWidth = shapeStrokeWidthInput.value;
        }

        updateShapeButton.disabled = true;
    })
}
