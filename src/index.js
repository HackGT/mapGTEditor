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
        select: new SelectTool(canvas),
        rectangle: new RectangleTool(canvas),
        polygon: new PolygonTool(canvas),
        upload: new UploadTool(canvas),
        export: new ExportTool(canvas)
    };

    const updateShapeButton = document.getElementById("update-shape");
    updateShapeButton.disabled = true;

    const shapeIdInput = document.getElementById("shape-id"),
        shapeClassInput = document.getElementById("shape-class"),
        shapeFillInput = document.getElementById("shape-fill"),
        shapeStrokeWidthInput = document.getElementById("shape-stroke-width");

    [
        shapeIdInput,
        shapeClassInput,
        shapeFillInput,
        shapeStrokeWidthInput
    ].forEach(element => {
        element.addEventListener("input", e => {
            updateShapeButton.disabled = false;
        });
    });

    updateShapeButton.addEventListener("click", e => {
        var currentShape = canvas.currentShape;

        if (shapeIdInput.value) {
            currentShape.domGroup.id = shapeIdInput.value;
        }

        if (shapeClassInput.value) {
            const classes = currentShape.domGroup.classList;
            for (let i = 0; i < classes.length; i++) {
                currentShape.domGroup.classList.remove(classes[i]);
            }
            const newClasses = shapeClassInput.value.split(" ");
            for (let newClass of newClasses) {
                currentShape.domGroup.classList.add(newClass);
            }
            currentShape.domGroup.classList.add("area");
        }

        if (shapeFillInput.value) {
            currentShape.domElement.style.fill = shapeFillInput.value;
        }

        if (shapeStrokeWidthInput.value) {
            currentShape.domElement.style.strokeWidth = shapeStrokeWidthInput.value;
        }

        updateShapeButton.disabled = true;
    });
};

// Service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("../serviceWorker.js").then(
            registration => {
                console.log(
                    "service worker registration successful with scope: ",
                    registration.scope
                );
            },
            err => {
                console.log("Service worker registration failed", err);
            }
        );
    });
}
