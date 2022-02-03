declare namespace Intel {
    interface ChatCallback {
        result: ChatLine[];
    }

    type ChatLine = [/*guid*/ string, /*time*/number, PlextContainer];
    type MarkUp = Array<MarkUpPortal | MarkUpPlayer | MarkUpText>;
    type TeamStr = "RESISTANCE" | "ENLIGHTENED";

    type MarkUp = Array<MarkUpPortal | MarkUpPlayer | MarkUpText>;

    interface PlextContainer {
        plext: {
            plextType: "SYSTEM_BROADCAST";
            markup: MarkUp;
            team: TeamStr;
            text: string;
        };
    }

    type MarkUpPlayer = ["PLAYER", MarkUpPlayerType];
    interface MarkUpPlayerType {
        team: TeamStr;
        plain: string;
    }

    type MarkUpText = ["TEXT", MarkUpTextType];
    interface MarkUpTextType {
        plain: string
        | " destroyed a Resonator on "
        | " deployed a Resonator on "
        | " deployed a Beacon on "
        | " linked " | " to "
        | " created a Control Field @" | " +" | " Mus"
        | " captured "
        ;
    }

    type MarkUpPortal = ["PORTAL", MarkUpPortalType];
    interface MarkUpPortalType {
        latE6: number;
        lngE6: number;
        team: TeamStr;
        plain: string;
        name: string;
        address: string;
    }
}