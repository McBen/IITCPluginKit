/**
 * @module IITC
 */


interface Window {

    // HOOKS
    /** register a callback for an event */
    addHook(event: "portalSelected", callback: (e: EventPortalSelected) => void): void;
    addHook(event: "publicChatDataAvailable", callback: (e: EventPublicChatDataAvailable) => void): void;
    addHook(event: "factionChatDataAvailable", callback: (e: EventFactionChatDataAvailable) => void): void;
    addHook(event: "portalDetailsUpdated", callback: (e: EventPortalDetailsUpdated) => void): void;
    addHook(event: "artifactsUpdated", callback: (e: EventArtifactsUpdated) => void): void;
    addHook(event: "mapDataRefreshStart", callback: (e: EventMapDataRefreshStart) => void): void;
    addHook(event: "mapDataEntityInject", callback: (e: EventMapDataEntityInject) => void): void;
    addHook(event: "mapDataRefreshEnd", callback: (e: EventMapDataRefreshEnd) => void): void;
    addHook(event: "portalAdded", callback: (e: EventPortalAdded) => void): void;
    addHook(event: "linkAdded", callback: (e: EventLinkAdded) => void): void;
    addHook(event: "fieldAdded", callback: (e: EventFieldAdded) => void): void;
    addHook(event: "portalRemoved", callback: (e: EventPortalRemoved) => void): void;
    addHook(event: "linkRemoved", callback: (e: EventLinkRemoved) => void): void;
    addHook(event: "fieldRemoved", callback: (e: EventFieldRemoved) => void): void;
    addHook(event: "requestFinished", callback: (e: EventRequestFinished) => void): void;
    addHook(event: "nicknameClicked", callback: (e: EventNicknameClicked) => boolean): void;
    addHook(event: "search", callback: (e: EventSearch) => void): void;
    addHook(event: "iitcLoaded", callback: () => void): void;
    addHook(event: "portalDetailLoaded", callback: (e: EventPortalDetailLoaded) => void): void;
    addHook(event: "paneChanged", callback: (e: EventPaneChanged) => void): void;

    addHook(event: string, callback: HookCallback): void;

    /** remove a registered a callback */
    removeHook(event: string, callback: HookCallback): void;

    /** trigger event */
    runHooks(event: string, data: any): boolean;

    /** register a custom event */
    pluginCreateHook(event: string): void;

    /** private hook table */
    _hooks: { [event: string]: HookCallback[] };
}


type HookCallback = (data: any) => boolean | void;

type EventPortalSelected = { selectedPortalGuid: string, unselectedPortalGuid: string };

type EventPublicChatDataAvailable = { raw: any, result: Intel.ChatLine[], processed: any };
type EventFactionChatDataAvailable = { raw: any, result: any, processed: any };
type EventPortalDetailsUpdated = { guid: string, portal: any, portalDetails: any, portalData: any };
type EventArtifactsUpdated = { old: any, new: any };
type EventMapDataRefreshStart = { bounds: any, mapZoom: any, dataZoom: any, minPortalLevel: any, tileBounds: any };
type EventMapDataEntityInject = { callback: () => void };
type EventMapDataRefreshEnd = {};
type EventPortalAdded = { portal: any, previousData: any };
type EventLinkAdded = { link: any };
type EventFieldAdded = { field: any };
type EventPortalRemoved = { portal: any, data: any };
type EventLinkRemoved = { link: any, data: any };
type EventFieldRemoved = { field: any, data: any };
type EventRequestFinished = { success: boolean };
type EventNicknameClicked = { event: any, nickname: string };
type EventSearch = any; /* class window.search.Query */
type EventPortalDetailLoaded = { guid: string, success: boolean, details: any, ent: any };
type EventPaneChanged = string;

