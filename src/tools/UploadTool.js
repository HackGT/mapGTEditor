import { Tool } from "./Tool";
import { handleUpload } from "../eventListeners";

export class UploadTool extends Tool {
    constructor(canvas) {
        super("add view", canvas, [],"fas fa-plus");
        this.domElement.addEventListener("click", this.onClickTool.bind(this), false);
    }

    onClickTool() {
        this._triggerUpload();
    }

    _triggerUpload() {
        const imageUpload = document.createElement("input");
        imageUpload.setAttribute("type", "file");
        imageUpload.setAttribute("id", "image-upload");
        imageUpload.style.display = "none";
        document.body.appendChild(imageUpload);

        imageUpload.click();
        imageUpload.addEventListener("change", handleUpload.bind(handleUpload, this.canvas, imageUpload));
    }
}