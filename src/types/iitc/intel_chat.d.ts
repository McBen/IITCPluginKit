declare namespace Intel {
    interface ChatCallback {
        result: ChatLine[];
    }

    type ChatLine = [/*guid*/ string, /*time*/number, PlextContainer];

    interface PlextContainer {
        plext: {
            plextType: "SYSTEM_BROADCAST";
            markup: Array<MarkUpPortal | MarkUpPlayer | MarkUpText>;
            team: "RESISTANCE" | "ENLIGHTENED";
            text: string;
        };
    }

    type MarkUpPlayer = ["PLAYER", MarkUpPlayerType];
    interface MarkUpPlayerType {
        team: string;
        plain: string;
    }

    type MarkUpText = ["TEXT", MarkUpTextType];
    interface MarkUpTextType {
        plain: string;
    }

    type MarkUpPortal = ["PORTAL", MarkUpPortalType];
    interface MarkUpPortalType {
        latE6: number;
        lngE6: number;
        team: string;
        plain: string;
        name: string;
        address: string;
    }
}