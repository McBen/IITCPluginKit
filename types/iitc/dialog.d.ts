/**
 * @module IITC
 */

/**
 * Creates a new dialog
 * 
 * @example 
 * var mydialog = dialog({ title:"Weclome", html: "Hello world"})
 */
declare function dialog(data: DialogOptions): JQuery;


// see https://jqueryui.com/dialog/

/**
 * Note: don't use: close,open or focus. these are reserved for iitc dialog useage
 */
interface DialogOptions {
    /** If set only one dialog can be open */
    id?: string;

    /** Dialog title */
    title?: string;

    /** Dialog contents - converted by convertTextToTableMagic
     * \n will be line breaks \t will be table fields
     */
    text?: string;

    /** Dialog contents (if no text) */
    html?: string | HTMLElement | JQuery;

    dialogClass?: string;
    classes?: any;

    /** single dialog 
     * default: false
    */
    modal?: boolean;

    /** moveable dialog 
     * default: true
    */
    draggable?: boolean;

    /** resizeable dialog (won't work in iitc out-of-the-box) 
     * default: false
    */
    resizable?: boolean;

    /** position, see: https://api.jqueryui.com/position/ */
    position?: any;

    /** size */
    height?: string | number;
    width?: string | number;
    maxHeight?: string;
    maxWidth?: string;
    minHeight?: string;
    minWidth?: string;

    autoOpen?: boolean;
    closeOnEscape?: boolean;
    hide?: any;
    appendTo?: any;

    /** Specifies the text for the close button */
    closeText?: string;

    closeCallback?: any;
    collapseCallback?: any;
    expandCallback?: any;
    collapseExpandCallback?: any;
    focusCallback?: any;
    blurCallback?: any;

    buttons?: JQueryUI.ButtonOptions[] | { [key: string]: () => void };
}
