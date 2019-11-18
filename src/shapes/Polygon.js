import { Shape } from './Shape';
import { Point } from '../canvas/Point';
import { onMouseDownNodePolygon, onMouseUpNodePolygon, onMouseMoveNodePolygon } from '../nodeEventListeners';
import { onMouseDownSelectPolygon } from '../eventListeners';

export class Polygon extends Shape {
    constructor(canvas,  d="", attributes={"stroke": "black", "fill": "transparent", "stroke-width": "0.5px"}) {
        super(canvas, "polygon", attributes);

        this.eventListeners = [
            {   
                event: "click",
                type: "select",
                callBack: this.onSelect.bind(this)
            },
            {
                event: "mousedown",
                type: "select",
                callBack: onMouseDownSelectPolygon.bind(this)
            }
        ];
        this.nodeEventListeners = [
            {
                event: "mousedown",
                type: "node",
                callBack: onMouseDownNodePolygon,
                invoke: false
            },
            {
                event: "mousemove",
                type: "node",
                callBack: onMouseMoveNodePolygon,
                invoke: false
            },
            {
                event: "mouseup",
                type: "node",
                callBack: onMouseUpNodePolygon,
                invoke: false
            }
        ]
        
        if (!d) {
            this.dParts = [
                {
                    type: "M",
                    values: [
                        this.initialCursorPosition.x,
                        this.initialCursorPosition.y
                    ],
                    node: this.canvas.createNode(new Point(this.initialCursorPosition.x, this.initialCursorPosition.y), this)
                },
                {
                    type: "L",
                    values: [
                        this.initialCursorPosition.x,
                        this.initialCursorPosition.y
                    ],
                    node: this.canvas.createNode(new Point(this.initialCursorPosition.x, this.initialCursorPosition.y), this)
                }
            ]; // abstraction to easily update and deal with d strings for the path :(
        } else {
            this.dParts = this._getDParts(d);
            this.completeShape();
        }

        this.render();
    }

    // M 123 109 L 343 101 L 343 119 L 277 193 Z 
    _getDParts(d) {
        const dSplit = d.split(" ").filter(part => {
            return part != "";
        });
        const mPart = {
            type: "M",
            values: [
                dSplit[1],
                dSplit[2]
            ],
            node: this.canvas.createNode(new Point(dSplit[1], dSplit[2]), this)
        }

        const dParts = [mPart];

        for (let i = 3; i < dSplit.length; i+=3) {
            if (dSplit[i] == "Z") {
                break;
            } else {
                dParts.push({
                    type: dSplit[i],
                    values: [
                        parseInt(dSplit[i+1]),
                        parseInt(dSplit[i+2])
                    ],
                    node: this.canvas.createNode(new Point(dSplit[i+1], dSplit[i+2]), this)
                })
            }
        }

        return dParts;
    }

    render() {
        this.changeAttributes({
            "d": this._getD()
        });
        this.updateNodes();
    }

    registerClick(newCursorPosition) {
        this.dParts.push({
            type: "L",
            values: [
                newCursorPosition.x,
                newCursorPosition.y
            ],
            node: this.canvas.createNode(new Point(newCursorPosition.x, newCursorPosition.y), this)
        });
        this.clickedCursorPositions.push(newCursorPosition);
    }

    updateNodes() {
        for (let part of this.dParts) {
            // part.node can be null if the specific dPart does not require a node
            if (part.node) {
                part.node.updateLocation(new Point(part.values[0], part.values[1]));
            }
        }
    }

    updateDParts(index, values) {
        if (index > this.dParts.length) {
            console.warn("Looks like you are doing some janky stuff with dParts. Please check your code!");
        } else {
            this.dParts[index].values = values;
            this.render();
        }
    }

    updateDPartsOffset(offsetX, offsetY) {
        for (let dPart of this.dParts) {
            if (dPart.type !== "Z") {
                dPart.values[0] += offsetX;
                dPart.values[1] += offsetY;
            }
        }
        this.domGroup.setAttributeNS(null, "transform", "translate(0, 0)");
        this.render();
    }


    // completes the polygon shape
    completeShape() {
        this.dParts.push({
            type: "Z",
            values: []
        });
        this.hideNodes();
        this.render();
    }

    /* --- helper methods --- */

    /* used in eventListeners.js */

    // updates the last two coordinates in the d string
    // mainly used for updating the UI
    updateLastCursorPosition(newCursorPosition) {
        const dPart = this.dParts[this.dParts.length - 1];
        dPart.values = [
            newCursorPosition.x,
            newCursorPosition.y
        ];
        dPart.node.updateLocation(new Point(newCursorPosition.x, newCursorPosition.y));
    }

    // used in eventListeners.js
    // returns the cursor position of the previous click
    getLastClickPosition() {
        const coordinates = this.dParts[this.dParts.length - 2].values;
        return new Point(coordinates[0], coordinates[1]);
    }

    /* --- END --- */

    /* Private methods */

    // returns a d string from dParts
    _getD() {
        let d = "";
        for (let o of this.dParts) {
            d += `${o.type} `;
            for (let value of o.values) {
                d+= `${value} `;
            }
        }
        return d;
    }
}