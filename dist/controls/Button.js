import { isiOS, isMobile } from "../Mobile";
export const Button = (options) => {
    const but = document.createElement("a");
    if (options.click) {
        but.addEventListener("click", (event) => {
            options.click();
        });
        if (isiOS()) {
            but.addEventListener("touchstart", () => options.click());
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
    if (options.id)
        but.id = options.id;
    if (!isMobile() && options.tooltip) {
        but.title = options.tooltip;
    }
    return but;
};
export const ButtonImage = (imageClass, click, tooltip) => {
    return Button({ classes: imageClass, click, tooltip });
};
