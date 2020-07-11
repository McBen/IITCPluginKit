/**
 * @module IITC
 */

declare function dialog(data: DialogOptions): JQuery;


interface DialogOptions {
    title?: string;
    html?: string | HTMLElement | JQuery;
    text?: string;
    dialogClass?: string;
    classes?: string;
    position?: any;
    modal?: boolean;
    draggable?: boolean;
    id?: string;
    height?: string | number;
    width?: string | number;
    maxHeight?: string;
    maxWidth?: string;
    minHeight?: string;
    minWidth?: string;
    autoOpen?: boolean;
    appendTo?: any;
    closeOnEscape?: boolean;
    closeText?: string;
    hide?: boolean;
    resizable?: boolean;

    closeCallback?: any;
    collapseCallback?: any;
    expandCallback?: any;
    collapseExpandCallback?: any;
    focusCallback?: any;
    blurCallback?: any;

    buttons?: JQueryUI.ButtonOptions[] | { [key: string]: () => void };
}
