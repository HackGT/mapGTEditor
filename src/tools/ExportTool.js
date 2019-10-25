import { Tool } from "./Tool";
import { saveAs } from 'file-saver';

export class ExportTool extends Tool {
    constructor(canvas) {
        super("export", canvas, [], "fas fa-file-download");
        this.domElement.addEventListener("click", this.onClickTool.bind(this)); // activating the click listener for the tool button
    }

    onClickTool() {
        const paths = Array.from(this.canvas.domElement.querySelectorAll("path"));
        paths.map(path => {
            path.setAttributeNS(null, "fill", "transparent");
            path.setAttributeNS(null, "stroke", "none");
        })
        const svgFile = new Blob([this.canvas.containerDomElement.innerHTML], { type: "image/svg+xml" });
        saveAs(svgFile, "map.svg");
    }
}