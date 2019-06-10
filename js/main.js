const svgns = "http://www.w3.org/2000/svg";
const canvas = new Canvas("canvas", "canvas-container");

window.addEventListener("load", () => {
    const selectButton = document.getElementById("select");
    const lineButton = document.getElementById("line");
    const rectangleButton = document.getElementById("rectangle");
    const polygonButton = document.getElementById("polygon");
    const fileSelector = document.getElementById("image-upload-input");
    const imageUpload = document.getElementById("image-upload");

    selectButton.addEventListener("click", () => {
        removeAllToolEventListeners();
        for (let i = 0; i < canvas.shapes.length; i++) {
            canvas.shapes[i].domElement.addEventListener("click", Shape.onSelect);
        }
    });

    lineButton.addEventListener("click", () => {
        cleanUpOnSelectingNewTool();
        canvas.canvasContainer.addEventListener("click", Path.onMouseClick);
    });

    rectangleButton.addEventListener("click", () => {
        cleanUpOnSelectingNewTool();
        canvas.canvasContainer.addEventListener("click", Rectangle.onMouseClick);
    });

    polygonButton.addEventListener("click", () => {
        cleanUpOnSelectingNewTool();
        canvas.canvasContainer.addEventListener("click", Polygon.onMouseClick);
    });

    imageUpload.addEventListener("click", () => {
        fileSelector.click();
    })

});

function cleanUpOnSelectingNewTool() {
    canvas.clickToggle = true;
    for (let i = 0; i < canvas.shapes.length; i++) {
        let shape = canvas.shapes[i];
        shape.domElement.removeEventListener("click", Shape.onSelect);
        shape.hideNodes();
    }
    removeAllToolEventListeners();
}

function removeAllToolEventListeners() {
    Path.removeEventListeners();
    Rectangle.removeEventListeners();
    Polygon.removeEventListeners()
}
