export interface CheckboxOptions {
    id?: string;
    text: string;
    click?: (sender: HTMLInputElement) => void;
    status?: boolean;
    tooltip?: string;
}

export const Checkbox = (options: CheckboxOptions): HTMLLabelElement => {

    const input = document.createElement("input");
    input.type = "checkbox";
    if (options.id) input.id = options.id;
    if (options.click) {
        input.addEventListener("change", (event: Event) => options.click!(<HTMLInputElement>event.target!));
    }

    if (options.status !== undefined) {
        input.checked = options.status;
    }

    const label = document.createElement("label");
    if (options.tooltip) label.title = options.tooltip;
    const text = document.createTextNode(options.text);


    label.append(input, text);
    return label;
}

export const Line = (): HTMLElement => {
    return document.createElement("hr");
}
