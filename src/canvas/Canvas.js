import { Point } from './Point';
import { SelectorNode } from '../selectorNode/SelectorNode';
import { saveAs } from 'file-saver';
import { Floor } from './Floor';

export const svgns = "http://www.w3.org/2000/svg";
export class Canvas {
    constructor(width, height, canvasId = "canvas", canvasContainerId = "canvas-container") {
        this.floors = [new Floor(1)];
        this.currentFloor = this.floors[0];
        this.domElement = document.createElementNS(svgns, "svg");

        // setting height, width and id of the canvas
        this.domElement.setAttributeNS(null, "width", width);
        this.domElement.setAttributeNS(null, "height", height);
        this.domElement.setAttributeNS(null, "id", "canvas");

        // looking for a container in which the editor will reside
        this.containerDomElement = document.getElementById(canvasContainerId);
        if (this.containerDomElement) {
            this.containerDomElement.appendChild(this.domElement);

            document.getElementById("export-button").onclick = () => {
                var svgFile = new Blob([this.containerDomElement.innerHTML], { type: "image/svg+xml" });
                saveAs(svgFile, "map.svg");
            }
        } else {
            console.err("Could not find a container to put the canvas svg in");
        }

        this.floors.forEach(floor => {
            this.domElement.appendChild(floor.domElement);

            var floorSelectButton = document.createElement("a");
            
            floorSelectButton.href = "#";
            floorSelectButton.text = floor.floorNum + " ";
            floorSelectButton.onclick = () => {
                console.log(floor);
                this.setCurrentFloor(floor);
            }

            document.getElementById("floor-buttons").appendChild(floorSelectButton);
        });

        document.getElementById("add-floor").onclick = () => this.createFloor();


        this.shapes = this.currentFloor.shapes; // stores a list of all COMPLETE shapes currently drawn on the canvas
        this.currentShape = null; // the shape that is selected, or is being drawn
        this.canvasId = canvasId; // MUST BE REMOVED IN NEXT ITERATION; NOT BEING USED ANYWHERE

        /* ---- IMPORTANT: PLEASE READ COMMENTS---- */
        this.currentTool = null; // the tool that is currently active
        this.currentEventListeners = []; // a set of event listeners that are active 
        // DO NOT UPDATE THESE VARIABLES DIRECTLY
        // CALL THE setCurrentTool() method to change the current tool, which in turn will update event listeners for you :)
        /* ---- END ---- */

        this.clicked = true; // is toggled on and off whenever the mouse is clicked; usually toggled in eventListeners.js


        /* ---- VARIABLES THAT ARE NOT BEING PROPERLY UPDATED AS OF THIS VERSION ----*/
        /* ---- USE WITH CAUTION ---- */
        // ideally want to use these instance variables to handle undo/redo
        // also change the names of these variables
        this.masterState = [];
        this.currentState = [];
        /* ---- END ---- */
        console.log(this.currentFloor);
    }

    // returns the current position of the cursor
    // mainly used for getting curson positions of click events
    getCursorPosition(event=window.event) {
        let x = event.clientX - this.containerDomElement.offsetLeft;
        let y = event.clientY - this.containerDomElement.offsetTop;
        return new Point(x, y);
    }

    /* ---- IMPLEMENT THIS ---- */
    // should return a unique ID
    // ID will be used to uniquely identify shapes
    // ping @1ntEgr8 before implementing
    getNewId() {
        return this.shapes.length;
    }
    /* ---- END ---- */

    // adds the shape to the canvas dom
    add(shape) {
        this.currentFloor.domElement.insertBefore(shape.domGroup, this.currentFloor.domElement.firstChild);
        this.clicked = false;
        this.currentShape = shape;

        this.masterState.push(shape);
        this.currentState.push(shape);
        this.shapes.push(shape);
    }

    // updates the current tool, and does necessary event listener handling
    setCurrentTool(tool) {
        this.currentTool = tool;
        this._removeEventListeners();
        this._setEventListeners(tool.eventListeners);
    }

    createNode(location, shape=this.currentShape) {
        const node = new SelectorNode(this, location, this._getNewNodeID(shape), shape.nodeEventListeners, "circle", {
            "fill": "cyan",
            "stroke": "black",
            "stroke-width": "3px",
            "r": "5px"
        });
        node.shapes.push(shape);
        shape.nodes.push(node);
        return node;
    }

    createFloor() {
        var newFloor = new Floor(this.floors.length + 1);
        this.domElement.appendChild(newFloor.domElement);
        this.floors.push(newFloor);

        this.domElement.appendChild(newFloor.domElement);

        var floorSelectButton = document.createElement("a");
        
        floorSelectButton.href = "#";
        floorSelectButton.text = newFloor.floorNum + " ";
        floorSelectButton.onclick = () => {
            console.log(newFloor);
            this.setCurrentFloor(newFloor);
        }

        document.getElementById("floor-buttons").appendChild(floorSelectButton);

        this.setCurrentFloor(newFloor);
    }

    setCurrentFloor(floor) {
        this.currentFloor.setVisible(false);
        floor.setVisible(true);
        this.currentFloor = floor;
    }

    updateNodeId(node, shape) {
        node.id += (shape.id + "/" + shape.nodes.length)
    }
    
    /* Private methods */
    
    // updates the event listeners in the canvas
    _setEventListeners(eventListeners) {
        if (!this.currentEventListeners) {
            this.currentEventListeners = eventListeners;
            eventListeners.forEach(listener => {
                if (listener.invoke) {
                    this.domElement.addEventListener(listener.event, listener.callBack);
                }
            });
        } else {
            console.warn("Setting new event listeners without removing old listeners");
        }
    }

    // removes current event listeners in the canvas
    _removeEventListeners() {
        this.currentEventListeners.forEach(listener => {
            this.domElement.removeEventListener(listener.event, listener.callBack);
        });
        this.currentEventListeners = null;
    }

    _getNewNodeID(shape) {
        return shape.id + "/" + shape.nodes.length;
    }
}
