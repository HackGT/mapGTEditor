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

        this.optionDOMElements = [];

        this.options.forEach(enabledOption => {
            this.optionDOMElements.push(this.optionMapping[enabledOption]());
        });
    }

    fillOptions() {
        var startingColors = [
            "red",
            "orange",
            "yellow",
            "green",
            "blue",
            "indigo",
            "violet"
        ]

        this.fill = {}; // Settings about the fill of a tool are stored in {ToolClass}.objects.fillSettings
        this.fill.color = startingColors[0];

        var colorList = document.createElement("div");
        colorList.style.display = "flex";
        colorList.style.flexWrap = "wrap";

        // Create colored square divs for initial palette
        startingColors.forEach(color => {
            var colorElement = this.createColorSelectorElement(color);
            colorList.appendChild(colorElement);
        })

        var optionsElement = document.createElement("div");
        var optionsTitle = document.createElement("span");
        optionsTitle.id = "options-title";
        optionsTitle.textContent = `Fill Color: ${this.fill.color}`;

        var colorSelectTextbox = document.createElement("input");
        var colorSelectButton = document.createElement("button");

        colorSelectButton.textContent = "Add";

        colorSelectButton.addEventListener("click", e => {
            var textboxValue = colorSelectTextbox.value;

            if (isValidCSSColor(textboxValue)) {
                var element = this.createColorSelectorElement(textboxValue);
                colorList.appendChild(element);
            } else {
                alert("Invalid color entered");
            }
        });

        colorSelectTextbox.addEventListener("keyup", e => {
            if (e.keyCode === 13) {
                colorSelectButton.click();
            }
        })

        optionsElement.appendChild(optionsTitle);
        optionsElement.appendChild(colorList);
        optionsElement.appendChild(colorSelectTextbox);
        optionsElement.appendChild(colorSelectButton);

        return optionsElement;
    }

    // Creates a colored square div for selecting fill color and attaches a click event listener
    createColorSelectorElement(color) {
        var element = document.createElement("div");
        var lowercasedColor = color.toLowerCase();
    
        element.style.display = "inline-block"
        element.style.backgroundColor = lowercasedColor;
        element.style.width = "20px";
        element.style.height = "20px";
        element.style.margin = "5px";
        element.style.border = "solid black 1px";
    
        element.addEventListener("click", e => {
            console.log(lowercasedColor);
            this.fill.color = lowercasedColor;
            document.getElementById("options-title").textContent = `Fill Color: ${this.fill.color}`;
        });    
    
        return element;
    }

    strokeOptions() {
        this.stroke = {}; // Settings about the stroke of a tool are stored in {ToolClass}.options.strokeSettings
        this.stroke["thickness"] = 3;

        var thicknessSlider = document.createElement("input");
        thicknessSlider.type = "range";
        thicknessSlider.min = 1;
        thicknessSlider.max = 10;
        thicknessSlider.value = this.stroke["thickness"];

        thicknessSlider.addEventListener("input", e => {
            this.stroke["thickness"] = e.target.value;
            optionsTitle.textContent = `Stroke Thickness: ${this.stroke['thickness']}`;
        })

        var optionsElement = document.createElement("div");
        var optionsTitle = document.createElement("span");
        optionsTitle.textContent = `Stroke Thickness: ${this.stroke['thickness']}`;

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

        this.optionDOMElements.forEach(optionDOM => {
            toolCustomizationPanel.appendChild(optionDOM);
        });
    }
}

// Checks if given string is a valid CSS color
function isValidCSSColor(string) {
    var s = new Option().style;
    s.color = string; // If the string is not valid, s.color should remain an empty string

    return s.color !== "";
}