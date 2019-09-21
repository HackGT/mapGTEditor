export class Tool {
    constructor(name, canvas, eventListeners) {
        this.name = name; // the name of the tool
        this.domElement = document.createElement("button"); // the button for the tool

        this.domElement.innerHTML = this.name; // updating the button text

        // looking for a container div to append the tools to
        const toolsDiv = document.querySelector(".tools");
        if (toolsDiv) {
            toolsDiv.appendChild(this.domElement);
        } else {
            console.err("No container div (with class `tool`) found");
        }

        this.canvas = canvas; // the canvas that the tools are associated with
        this.eventListeners = eventListeners; // list of event listeners that the tool supports / needs

        /*
            THE EVENT LISTENER ABSTRACTION USED IN THE CODEBASE

            To allow for easy manipulation of event listeners, the following abstraction is used
            Every event listener is an object that looks like this:
            {
                "event": <eventType>,
                "callBack": <callBackFunction>,
                "invoke": <true or false>,
                "type": <what is this going to be used for> [THIS IS OPTIONAL]
            }
            Note: the "type" attribute is populated mainly in the event listener attributes for shape specific classes
            It is used to decide which event listener needs to be toggled

            You may not need it when you are creating a new Tool class.
            
            Use editEventListenerInvokeStatus() to toggle event listeners
        */
       
        // binding the event listeners to the tool
        // Chose binding since all event listeners are stored in eventListeners.js to prevent bloat in this class
        for (let i = 0; i < this.eventListeners.length; i++) {
            this.eventListeners[i].callBack = this.eventListeners[i].callBack.bind(this);
        }
    }

    // method gets fired whenever the tool is clicked
    onClickTool() {
        this.canvas.setCurrentTool(this);
    }

    // updates the status of the event listener (active or not)
    // this method works well with the abstraction for event listeners used in the codebase
    editEventListenerInvokeStatus(event, invoke) {
        const els = this.eventListeners;

        for (let i = 0; i < els.length; i++) {
            if (els[i].event === event) 
            {
                els[i].invoke = invoke;
                if (invoke) {
                    this.canvas.domElement.addEventListener(els[i].event, els[i].callBack);
                } else {
                    this.canvas.domElement.removeEventListener(els[i].event, els[i].callBack);
                    this.canvas.clicked = true;
                }
            }
        }
    }
}
