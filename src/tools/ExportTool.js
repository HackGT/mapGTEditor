import { Tool } from "./Tool";
import { onMouseClickExportButton } from "../eventListeners";
import { saveAs } from 'file-saver';

export class ExportTool extends Tool {
    constructor(canvas) {
        super("export", canvas, [], "fas fa-file-download");
        this.domElement.addEventListener("click", this.onClickTool.bind(this)); // activating the click listener for the tool button
    }

    onClickTool() {
        const svgFile = new Blob([this.canvas.containerDomElement.innerHTML], { type: "image/svg+xml" });
        saveAs(svgFile, "map.svg");
    }
}