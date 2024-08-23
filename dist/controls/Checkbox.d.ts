export interface CheckboxOptions {
    id?: string;
    text: string;
    click?: (sender: HTMLInputElement) => void;
    status?: boolean;
    tooltip?: string;
}
export declare const Checkbox: (options: CheckboxOptions) => HTMLLabelElement;
export declare const Line: () => HTMLElement;
