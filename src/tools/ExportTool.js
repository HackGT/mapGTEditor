import { Tool } from "./Tool";
import { onMouseClickExportButton } from "../eventListeners";

export class ExportTool extends Tool {
    constructor(canvas) {
        super("export", canvas, [
            {
                "event": "click",
                "callBack": onMouseClickExportButton,
                "invoke": true,
            }
        ], "fas fa-file-download");
    }
}