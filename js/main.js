const svgns = "http://www.w3.org/2000/svg";
const canvas = new Canvas("canvas", "canvas-container");

window.addEventListener("load", () => {
    let selectButton = document.getElementById("select");
    let lineButton = document.getElementById("line");
    
    selectButton.addEventListener("click", () => {
        Path.removeEventListeners();
        for (let i = 0; i < canvas.shapes.length; i++) {
            canvas.shapes[i].domElement.addEventListener("click", Shape.onSelect);
        }
    });
    
    lineButton.addEventListener("click", () => {
        // refactor this
        canvas.clickToggle = true;
        for (let i = 0; i < canvas.shapes.length; i++) {
            let shape = canvas.shapes[i];
            shape.domElement.removeEventListener("click", Shape.onSelect);
            shape.hideNodes();
        }
        canvas.canvas.addEventListener("click", Path.onMouseClick);
    });
});