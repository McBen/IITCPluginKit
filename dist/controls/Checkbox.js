export const Checkbox = (options) => {
    const input = document.createElement("input");
    input.type = "checkbox";
    if (options.id)
        input.id = options.id;
    if (options.click) {
        input.addEventListener("change", (event) => options.click(event.target));
    }
    if (options.status !== undefined) {
        input.checked = options.status;
    }
    const label = document.createElement("label");
    if (options.tooltip)
        label.title = options.tooltip;
    const text = document.createTextNode(options.text);
    label.append(input, text);
    return label;
};
export const Line = () => {
    return document.createElement("hr");
};
