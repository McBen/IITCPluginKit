import * as L from "leaflet";

declare global {
    type LayerInfo = {
        layerId: number;
        name: string;
        active: boolean;
    };

    type LayerEntryOption = Partial<{
        /**
         * baselayer:
         * When `false` - baselayer's status is not tracked.
         *
         * overlays:
         * When `true` (or not specified) - adds overlay to the map as well,
         * if it's last state was active.
         * If no record exists then value specified in `default` option is used.
         *  When `false` - overlay status is not tracked, `default` option is honored too.
         */
        persistent: boolean;

        /**
         * @option sortPriority: Number = *
         * Enforces specific order in control, lower value means layer's upper position.
         * If not specified - the value will be assigned implicitly in increasing manner.
         */
        sortPriority: number;
        sortLayers: boolean;

        /**
         * overlays:
         * @option default: Boolean = true
         * Default state of overlay (used only when no record about previous state found).
         */

        default: boolean;
        autoZIndex: boolean;

        /**
         * overlays:
         * @option enable: Boolean
         * Enforce specified state ignoring previously saved.
         */
        enable: boolean;
    }>;

    class LayerChooser extends L.Control.Layers {
        _layers: { [id: number]: { layer: L.ILayer, name: string, overlay: boolean } };
        options: {
            // @option sortLayers: Boolean = true
            // Ensures stable sort order (based on initial), while still providing ability
            // to enforce specific order with `addBaseLayer`/`addOverlay`
            // `sortPriority` option.
            sortLayers: boolean,

            // @option sortFunction: Function = *
            // A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
            // that will be used for sorting the layers, when `sortLayers` is `true`.
            // The function receives objects with the layers's data.
            sortFunction: (A: any, B: any) => number;
        };


        /**
         * Adds a base layer (radio button entry) with the given name to the control.
         */
        // addBaseLayer(layer: L.LayerGroup<any>, name: string, options?: LayerEntryOption): LayerCooser;
        // addOverlay(layer: L.LayerGroup<any>, name: string, options?: LayerEntryOption): LayerCooser;

        /**
         *  Removes the given layer from the control.
         *  Either layer object or it's name in the control must be specified.
         *  Layer is removed from the map as well, except `.keepOnMap` option is true.
         */
        // removeLayer(layer: L.LayerGroup<any> | string, options?: { keepOnMap: boolean }): void;

        // @method layerInfo(name: String|Layer): Layer
        // Returns layer info by it's name in the control, or by layer object itself,
        // or label html element.
        // Info is internal data object with following properties:
        // `layer`, `name`, `label`, `overlay`, `sortPriority`, `persistent`, `default`,
        // `labelEl`, `inputEl`, `statusTracking`.
        layerInfo(layer: string | L.LayerGroup<any>): any;

        // @method getLayer(name: String|Layer): Layer
        // Returns layer by it's name in the control, or by layer object itself,
        // or label html element.
        // The latter can be used to ensure the layer is in layerChooser.
        getLayer(layer: string | L.LayerGroup<any>): any;

        // @method setLabel(layer: String|Layer, label?: String): this
        // Sets layers label to specified label text (html),
        // or resets it to original name when label is not specified.
        setLabel(layer: string | L.LayerGroup<any>, label: string): void;

        getLayers(): { baseLayers: LayerInfo[], overlayLayers: LayerInfo[] };
        showLayer(id: number, show: boolean): boolean;
    }

    const layerChooser: LayerChooser;

    /**
     * @deprecated: use `layerChooser.addOverlay` directly
     */
    function addLayerGroup(name: string, layerGroup: L.LayerGroup<any>, defaultDisplay: boolean): void;

    /**
     * @deprecated: use `layerChooser.removeLayer` directly
     * our method differs from inherited (https://leafletjs.com/reference.html#control-layers-removelayer),
     * as (by default) layer is removed from the map as well, see description for more details.
     */
    function removeLayerGroup(layerGroup: L.LayerGroup<any>): void;
}
