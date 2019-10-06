import { Tool } from "./Tool";
import { svgns } from "../canvas/Canvas";
import { Point } from "../canvas/Point";

export class UploadTool extends Tool {
    constructor(canvas) {
        super("add view", canvas, [],"fas fa-plus");
        this.domElement.addEventListener("click", this.onClickTool.bind(this), false);
    }

    onClickTool() {
        const canvas = this.canvas;
        // creating dummy file input dom element
        const imageUpload = document.createElement("input");
        imageUpload.setAttribute("type", "file");
        imageUpload.setAttribute("id", "image-upload");
        imageUpload.style.display = "none";
        document.body.appendChild(imageUpload);

        // clicking the input to add the file from disk
        imageUpload.click();
        imageUpload.addEventListener("change", function() {
            const file = this.files[0];
            if (!file.type.startsWith('image/')) {
                alert("Only image files can be uploaded");
                return;
            }
            const viewId = "view" + canvas.views.length;
            const img = document.createElementNS(svgns,'image');
            img.setAttributeNS(null, "x", 0);
            img.setAttributeNS(null, "y", 0);
            img.setAttributeNS(null, "width", "1100px");
            img.setAttributeNS(null, "height", "600px");
            img.setAttributeNS(null, "id", viewId + "image");
            img.setAttributeNS(null, "cursor", "grab");
            img.file = file;

            for (let i = 0; i < canvas.views.length; i++) {
                canvas.views[i].setAttributeNS(null, "visibility", "hidden");
            }
            const newView = document.createElementNS(svgns, "g");
            newView.setAttributeNS(null, "class", "view");
            newView.setAttributeNS(null, "id", viewId);
            const nodesGroup = document.createElementNS(svgns, "g");
            nodesGroup.setAttributeNS(null, "id", viewId + "nodes");
            newView.appendChild(nodesGroup);
            canvas.domElement.appendChild(newView);
            canvas.views.push(newView);

            document.getElementById(viewId).appendChild(img);
            
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
            const decline = document.createElement("button");

            zoomin.innerHTML = `<i class="fas fa-search-plus"></i>`;
            zoomout.innerHTML = `<i class="fas fa-search-minus"></i>`;
            confirm.innerHTML = `<i class="fas fa-check"></i>`;
            confirm.style.background= "#42f569";
            decline.innerHTML = `<i class="fas fa-times"></i>`;
            decline.style.background= "#f54242";

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

            const viewDetailsBar = document.querySelector(".view-extra");
            viewDetailsBar.appendChild(zoomin);
            viewDetailsBar.appendChild(zoomout);
            viewDetailsBar.appendChild(confirm);
            viewDetailsBar.appendChild(decline);

            confirm.addEventListener("click", () => {
                zoomin.remove();
                zoomout.remove();
                confirm.remove();
                decline.remove();
                img.setAttributeNS(null, "cursor", "default");
                img.removeEventListener("mousedown", onMouseDownImgUpload);
                imageUpload.remove();
                canvas.addNewView(newView);
            });

            decline.addEventListener("click", () => {
                zoomin.remove();
                zoomout.remove();
                confirm.remove();
                decline.remove();
                img.removeEventListener("mousedown", onMouseDownImgUpload);
                img.remove();
                newView.remove();
                imageUpload.remove();
            });
        });
    }
}