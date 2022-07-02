/**
 * @module IITC
 */

type PortalGUID = string;
type LinkGUID = string;
type FieldGUID = string;
type TileID = string;

declare namespace IITC {

    /** Portal-Marker */
    interface Portal extends L.CircleMarker {
        options: PortalOptions;
    }


    interface PortalOptions extends L.CircleOptions {
        guid: PortalGUID;
        ent: any;
        level: number;
        team: number;
        timestamp: number;
        data: PortalData;
    }

    interface PortalData {
        artifactBrief: any;
        health: number;
        image: string; // url
        level: number;
        latE6: number;
        lngE6: number;
        mission: boolean;
        mission50plus: boolean;
        ornaments?: Ornaments[];
        resCount: number;
        team: string;
        timestamp: number;
        title: string;
    }

    type Ornaments =
        "peFRACK" | /** fracker */
        "sc5_p" | /** scout control */
        "peBB_BATTLE" | /** BB - Battle */
        "peBN_RES_WINNER" | /** BB - RES winner */
        "peBN_ENL_WINNER" | /** BB - ENL winner */
        "peBN_TIED_WINNER" |  /** BB - Tie */
        "peENL" |
        "peRES" |
        "peFW_ENL" | /** Firework */
        "peFW_RES" | /** Firework */
        'peBN_BLM' | /** Black lives matter */
        'peNEMESIS' |
        'peTOASTY' |
        string;


    interface PortalDataDetail extends PortalData {
        artifactDetail: any;
        mods: [Mod | null, Mod | null, Mod | null, Mod | null];
        owner: string;
        resonators: Resonator[];
    }

    interface Mod {
        owner: string;
        name: string;
        rarity: ModRarity;
        stats: { [k: ModStats]: string };
    }
    type ModStats = "REMOVAL_STICKNESS" | /* all */
        /* Shield */ "MIGRATION" |
        /* Turret */ "ATTACK_FREQUENCY" | "HIT_BONUS" |
        /* Forceamp */ "FORCE_AMPLIFIER" |
        /* ito- */ "XM_SPIN" |
        /* Multihack */ "BURNOUT_INSULATION" |
        /* Heat sink */ "HACK_SPEED" |
        /* Linkamp */ "LINK_RANGE_MULTIPLIER" |
        /* sbul */ "LINK_DEFENSE_BOOST" |
        string; /* dummy for future stuff */
    type ModRarity = "COMMON" | "RARE" | "VERY_RARE";

    interface Resonator {
        energy: number;
        level: number;
        owner: string;
    }

    /** Link-Marker */
    interface Link extends L.GeodesicPolyline {
        options: LinkOptions;
    }

    interface LinkOptions extends L.PathOptions {
        team: number;
        guid: string;
        timestamp: number;
        data: LinkData;
    }

    interface LinkData {
        dGuid: string;
        dLatE6: number;
        dLngE6: number;
        oGuid: string;
        oLatE6: number;
        oLngE6: number;
        team: string;
    }

    /** Field-Polygon */
    interface Field extends L.GeodesicPolygon {
        options: FieldOptions;
    }

    interface FieldOptions extends L.PathOptions {
        team: number;
        guid: string;
        timestamp: number;
        data: FieldData;
    }

    interface FieldData {
        team: string;
        points: {
            guid: string;
            latE6: number;
            lngE6: number;
        }[];
    }

    /** Search */
    interface SearchQuery {
        term: string,
        confirmed: boolean,
        addResult(result: SearchResultPosition | SearchResultBounds): void;
    }

    interface SearchResultPosition extends SearchResult {
        position: L.LatLngExpression;
    }

    interface SearchResultBounds extends SearchResult {
        bounds: L.LatLngBoundsExpression;
    }

    interface SearchResult {
        title: string; // Will be interpreted as HTML, so make sure to escape properly.
        description: JQuery | any[] | Element | Text | string;
        layer?: L.ILayer; // a ILayer to be added to the map when the user selects this search result. Will be generated if not set. Set to `null` to prevent the result from being added to the map.
        icon?: string; // a URL to a icon to display in the result list. Should be 12x12.
        onSelected?: (result: SearchResult, event: UIEvent) => (boolean | void); // a handler to be called when the result is selected. May return `true` to prevent the map from being repositioned. You may reposition the map yourself or do other work.
        onRemove?: (result: SearchResult) => void;
    }

    interface TileParameters {
        level: number; // deprecated
        tilesPerEdge: number;
        minLinkLength: number;
        hasPortals: boolean;
        zoom: number;
    }
}
