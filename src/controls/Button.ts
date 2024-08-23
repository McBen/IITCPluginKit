import { isiOS, isMobile } from "../Mobile";

export interface ButtonDefinition {
    classes: string;
    click: () => void;
    tooltip: string;
    id: string;
    text: string;
}


export const Button = (options: Partial<ButtonDefinition>): HTMLAnchorElement => {
    const but = document.createElement("a");

    if (options.click) {
        but.addEventListener("click", (event: MouseEvent) => {
            options.click!()
        });

        if (isiOS()) {
            but.addEventListener("touchstart", () => options.click!());
        }
    }

    if (options.text) {
        const text = document.createTextNode(options.text);
        but.append(text);
        but.classList.add("text");
    }
    if (options.classes) {
        options.classes.split(" ").forEach(s => but.classList.add(s));
    }

    if (options.id) but.id = options.id;

    if (!isMobile() && options.tooltip) {
        but.title = options.tooltip;
    }
    return but;
}


export const ButtonImage = (imageClass: string, click: () => void, tooltip?: string): HTMLElement => {
    return Button({ classes: imageClass, click, tooltip })
}



