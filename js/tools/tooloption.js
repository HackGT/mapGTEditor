/**
 * Class for generating options for tools. Types of options are specified as string arguments in the constructor
 * and mapped to functions that return DOM elements that are displayed in the tool customization panel on the right.
 * This object is intended to be applied in an "options" key on the class representing that tool.
 * 
 * For example:
 * rectangle.js contains the Rectangle class. At the very bottom, Rectangle.options is set to a new ToolOption
 * with "fill" and "stroke" passed into its constructor. Any associated values in the Rectangle class that needs
 * to be altered with those options can be set to values in the Rectangle.options object.
 */

class ToolOption {
    constructor(...options) {
        this.options = options;
        this.optionMapping = {
            "fill": () => this.fillOptions(),
            "stroke": () => this.strokeOptions()
        }
    }

    fillOptions() {
        this.fillSettings = {}; // Settings about the fill of a tool are stored in {ToolClass}.objects.fillSettings
        this.fillSettings["color"] = "#000000";
        var colorList = document.createElement("div");
        colorList.style.display = "flex";
        colorList.style.flexWrap = "wrap";

        var colors = [
            "red",
            "orange",
            "yellow",
            "green",
            "blue",
            "indigo",
            "violet"
        ]

        var colorOptionDivs = [];

        colors.forEach(color => {
            var colorElement = document.createElement("div");
            colorElement.style.display = "inline-block"
            colorElement.style.backgroundColor = color;
            colorElement.style.width = "20px";
            colorElement.style.height = "20px";
            colorElement.style.margin = "5px";
            colorElement.style.border = "solid black 1px";

            colorOptionDivs.push(colorElement);

            colorElement.addEventListener("click", e => {
                console.log(color);
                this.fillSettings["color"] = color;

                colorOptionDivs.forEach(element => {
                    element.style.border = "solid black 1px";
                });

                colorElement.style.border = "solid white 1px";
            });

            colorList.appendChild(colorElement);
        })

        var optionsElement = document.createElement("div");
        var optionsTitle = document.createElement("span");
        optionsTitle.textContent = "Fill Color";

        optionsElement.appendChild(optionsTitle);
        optionsElement.appendChild(colorList);

        return optionsElement;
    }

    strokeOptions() {
        this.strokeSettings = {}; // Settings about the stroke of a tool are stored in {ToolClass}.options.strokeSettings
        this.strokeSettings["thickness"] = 3;

        var thicknessSlider = document.createElement("input");
        thicknessSlider.type = "range";
        thicknessSlider.min = 1;
        thicknessSlider.max = 10;
        thicknessSlider.value = this.strokeSettings["thickness"];

        thicknessSlider.addEventListener("input", e => {
            this.strokeSettings["thickness"] = e.target.value;
            optionsTitle.textContent = `Stroke Thickness: ${this.strokeSettings['thickness']}`;
        })

        var optionsElement = document.createElement("div");
        var optionsTitle = document.createElement("span");
        optionsTitle.textContent = `Stroke Thickness: ${this.strokeSettings['thickness']}`;

        optionsElement.appendChild(optionsTitle);
        optionsElement.appendChild(thicknessSlider);

        return optionsElement;
    }

    // Go through each option defined in the array and call their associated methods stored in optionMapping
    // to get the DOM elements to display in the customization panel
    render() {
        var toolCustomizationPanel = document.getElementById("tool-customization");

        while (toolCustomizationPanel.hasChildNodes()) {
            toolCustomizationPanel.removeChild(toolCustomizationPanel.lastChild);
        }

        this.options.forEach(enabledOption => {
            toolCustomizationPanel.appendChild(this.optionMapping[enabledOption]());
        });
    }
}