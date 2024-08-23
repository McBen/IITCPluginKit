export interface ButtonDefinition {
    classes: string;
    click: () => void;
    tooltip: string;
    id: string;
    text: string;
}
export declare const Button: (options: Partial<ButtonDefinition>) => HTMLAnchorElement;
export declare const ButtonImage: (imageClass: string, click: () => void, tooltip?: string) => HTMLElement;
