class Tool {
    constructor(name, canvas, eventListeners) {
        this.name = name;
        // this.active = false;
        this.domElement = document.createElement("button");
        this.domElement.innerHTML = this.name;
        const toolsDiv = document.querySelector(".tools");
        if (toolsDiv) {
            toolsDiv.appendChild(this.domElement);
        } else {
            console.err("No container div (with class `tool`) found");
        }
        this.canvas = canvas;
        this.eventListeners = eventListeners;
        for (let i = 0; i < this.eventListeners.length; i++) {
            this.eventListeners[i].callBack = this.eventListeners[i].callBack.bind(this);
        }
        this.domElement.addEventListener("click", this.onClickTool.bind(this));
    }

    onClickTool() {
        this.canvas.setCurrentTool(this);
    }

    editEventListenerInvokeStatus(type, invoke) {
        let els = this.eventListeners;

        for (let i = 0; i < els.length; i++) {
            if (els[i].event === type) 
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
