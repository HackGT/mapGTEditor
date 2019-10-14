import { Rectangle } from './shapes/Rectangle';
import { Polygon } from './shapes/Polygon';
import { Point } from './canvas/Point';
import { svgns } from "./canvas/Canvas";

/* All event listener callbacks go in this file */

/* --- RECTANGLE EVENT LISTENERS --- */
export function onMouseClickRectangle() {
    const rect = this.canvas.currentShape;
    if (this.canvas.clicked) {
        this.canvas.add(new Rectangle(this.canvas));
        this.editEventListenerInvokeStatus("mousemove", true);
    } else {
        this.editEventListenerInvokeStatus("mousemove", false);
        rect.registerClick(this.canvas.getCursorPosition(event));
    }
}

export function onMouseMoveRectangle(event) {
    const rect = this.canvas.currentShape;
    rect.registerClick(this.canvas.getCursorPosition(event));
}
/* --- END --- */

/* --- POLYGON EVENT LISTENERS ---*/
export function onMouseClickPolygon(event) {
    if (this.canvas.clicked) {
        this.canvas.add(new Polygon(this.canvas));
        this.editEventListenerInvokeStatus("mousemove", true);
    } else {
        const polygon = this.canvas.currentShape;
        const currentClickPosition = this.canvas.getCursorPosition(event);
        const lastClickPosition = polygon.getLastClickPosition();

        if (currentClickPosition.equals(polygon.initialCursorPosition) || currentClickPosition.equals(lastClickPosition)) {
            polygon.nodes[polygon.nodes.length - 1].domElement.remove();
            polygon.nodes.pop();
            polygon.dParts.pop(polygon.dParts.length - 2);
            polygon.completeShape();
            this.editEventListenerInvokeStatus("mousemove", false);
        } else {
            polygon.registerClick(currentClickPosition);
        }
    }
}

export function onMouseMovePolygon(event) {
    const polygon = this.canvas.currentShape;
    polygon.updateLastCursorPosition(this.canvas.getCursorPosition(event));
    polygon.render();
}
/* --- END --- */

/* --- UPLOAD EVENT LISTENERS --- */
export function handleUpload(canvas, inputBtn) {
    canvas.hideViews();
    const file = inputBtn.files[0],
        viewId = `view${canvas.views.length}`,
        view = canvas.createView();
    const img = loadImage(file, view, viewId);

    /* --- IMAGE DRAGGING --- */
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
    /* --- END IMAGE DRAGGING --- */

    /* --- ZOOM and CONFIRM --- */
    const zoomin = document.createElement("button"),
        zoomout = document.createElement("button"),
        confirm = document.createElement("button"),
        decline = document.createElement("button"),
        imageUpload = document.getElementById("image-upload");
    
    zoomin.innerHTML = `<i class="fas fa-search-plus"></i>`;
    zoomout.innerHTML = `<i class="fas fa-search-minus"></i>`;
    confirm.innerHTML = `<i class="fas fa-check"></i>`;
    confirm.style.background= "#42f569";
    decline.innerHTML = `<i class="fas fa-times"></i>`;
    decline.style.background= "#f54242";

    const viewDetailsBar = document.querySelector(".view-extra");
    viewDetailsBar.appendChild(zoomin);
    viewDetailsBar.appendChild(zoomout);
    viewDetailsBar.appendChild(confirm);
    viewDetailsBar.appendChild(decline);

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
    });

    confirm.addEventListener("click", () => {
        removeButtons();
        img.setAttributeNS(null, "cursor", "default");
        canvas.addNewViewToOptions(view);
    });

    decline.addEventListener("click", () => {
        removeButtons();
        img.remove();
        canvas.removeLastView();
    });
    /* --- END ZOOM and CONFIRM --- */

    function removeButtons() {
        zoomin.remove();
        zoomout.remove();
        confirm.remove();
        decline.remove();
        imageUpload.remove();
        img.removeEventListener("mousedown", onMouseDownImgUpload);
    }
}

function loadImage(file, view, id) {
    if (!file.type.startsWith('image/')) {
        alert("Only image files can be uploaded");
        return;
    }
    const img = document.createElementNS(svgns, 'image');
    img.setAttributeNS(null, "x", 0);
    img.setAttributeNS(null, "y", 0);
    img.setAttributeNS(null, "width", "1100px");
    img.setAttributeNS(null, "height", "600px");
    img.setAttributeNS(null, "id", `${id}image`);
    img.setAttributeNS(null, "cursor", "grab");
    img.file = file;

    view.appendChild(img);

    const reader = new FileReader();
    reader.onload = (function(aImg) {
        return function(e) {
            aImg.setAttributeNS(null, "href", e.target.result);
            aImg.src = e.target.result;
        };
    })(img);
    reader.readAsDataURL(file);
    return img;
}
