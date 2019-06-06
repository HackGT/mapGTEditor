const svgns = "http://www.w3.org/2000/svg";
const canvas = new Canvas("canvas", "canvas-container");

window.addEventListener("load", () => {
    let selectButton = document.getElementById("select");
    let lineButton = document.getElementById("line");
    let rectangleButton = document.getElementById("rectangle");
    let polygonButton = document.getElementById("polygon");

    canvas.add(new Polygon(new Point(100,200),[
        new Point(400,200),
        new Point(400,300),
        new Point(100,300),
        new Point(100,200)
    ]));

    selectButton.addEventListener("click", () => {
        removeAllToolEventListeners();
        for (let i = 0; i < canvas.shapes.length; i++) {
            canvas.shapes[i].domElement.addEventListener("click", Shape.onSelect);
        }
    });

    lineButton.addEventListener("click", () => {
        cleanUpOnSelectingNewTool();
        canvas.canvas.addEventListener("click", Path.onMouseClick);
    });

    rectangleButton.addEventListener("click", () => {
        cleanUpOnSelectingNewTool();
        canvas.canvas.addEventListener("click", Rectangle.onMouseClick);
    });

    polygonButton.addEventListener("click", () => {
        cleanUpOnSelectingNewTool();
        canvas.canvas.addEventListener("click", Polygon.onMouseClick);
    });
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
    Polygon.removeEventListeners();
}
