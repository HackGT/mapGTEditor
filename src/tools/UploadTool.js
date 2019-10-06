import { Tool } from "./Tool";
import { svgns } from "../canvas/Canvas";
import { Point } from "../canvas/Point";

export class UploadTool extends Tool {
    constructor(canvas) {
        super("add view", canvas, [],"fas fa-plus");
        this.imageUpload = document.createElement("input");

        this.imageUpload.setAttribute("type", "file");
        this.imageUpload.setAttribute("id", "image-upload");
        this.imageUpload.style.display = "none";

        document.body.appendChild(this.imageUpload);

        this.domElement.addEventListener("click", this.onClickTool.bind(this));
    }

    onClickTool() {
        this.imageUpload.click();
        this.imageUpload.addEventListener("change", function() {
            const file = this.files[0];

            if (!file.type.startsWith('image/')) {
                alert("Only image files can be uploaded");
                return;
            }

            const img = document.createElementNS(svgns,'image');
            img.setAttributeNS(null, "x", 0);
            img.setAttributeNS(null, "y", 0);
            img.setAttributeNS(null, "width", "1100px");
            img.setAttributeNS(null, "height", "600px");
            img.setAttributeNS(null, "id", "uploaded-image");
            img.file = file;
            document.getElementById("canvas").appendChild(img);
            
            const reader = new FileReader();
            reader.onload = (function(aImg) {
                return function(e) {
                    aImg.setAttributeNS(null, "href", e.target.result);
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

            img.addEventListener("mousedown", onMouseDownImgUpload);

            let mouseMove;
            function onMouseDownImgUpload(e) {
                const initialCursorLocation = new Point(e.clientX, e.clientY);
                mouseMove = onMouseMoveImgUpload.bind(this, initialCursorLocation);
                img.addEventListener("mousemove", mouseMove);
            }

            function onMouseMoveImgUpload(initialCursorLocation, e) {
                let currentCursorLocation = new Point(e.clientX, e.clientY);
                let diff = Point.subtract(currentCursorLocation, initialCursorLocation);
                img.setAttributeNS(null, "x", diff.x);
                img.setAttributeNS(null, "y", diff.y);
                img.addEventListener("mouseup", onMouseUpImgUpload);
            }

            function onMouseUpImgUpload() {
                img.removeEventListener("mousemove", mouseMove);
                img.removeEventListener("mouseup", onMouseUpImgUpload);
            }

            const zoomin = document.createElement("button");
            const zoomout = document.createElement("button");
            const confirm = document.createElement("button");

            zoomin.innerHTML = "zoom in";
            zoomout.innerHTML = "zoom out";
            confirm.innerHTML = "confirm";

            zoomin.addEventListener("click", () => {
                let width = img.attributes.width.nodeValue;
                let height = img.attributes.height.nodeValue;
                width = parseInt(width.slice(0, width.length - 2));
                height = parseInt(height.slice(0, height.length - 2));

                img.setAttributeNS(null, "width", width * 1.1 + "px");
                img.setAttributeNS(null, "height", height * 1.1 + "px");
            });
            zoomout.addEventListener("click", () => {
                let width = img.attributes.width.nodeValue;
                let height = img.attributes.height.nodeValue;

                width = parseInt(width.slice(0, width.length - 2));
                height = parseInt(height.slice(0, height.length - 2));

                img.setAttributeNS(null, "width", width * 0.9 + "px");
                img.setAttributeNS(null, "height", height * 0.9 + "px");
            })

            document.body.appendChild(zoomin);
            document.body.appendChild(zoomout);
            document.body.appendChild(confirm);

            confirm.addEventListener("click", () => {
                zoomin.remove();
                zoomout.remove();
                confirm.remove();
                img.removeEventListener("mousedown", onMouseDownImgUpload);
            })
        });
    }
}