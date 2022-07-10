declare namespace JQueryUI {
    interface SpectrumOptions {
        flat: boolean;
        clickoutFiresChange: boolean;
        showInput: boolean;
        showButtons: boolean;
        showPalette: boolean;
        showSelectionPalette: boolean;
        preferredFormat: "hex";
        className?: string;
        containerClassName?: string;
        palette: string[][];
    }
}

interface JQuery {
    spectrum(): JQuery;
    spectrum(options: JQueryUI.SpectrumOptions): JQuery;
    spectrum(methode: "set", value: string): JQuery;
}
