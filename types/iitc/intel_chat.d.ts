declare namespace Intel {
    interface ChatCallback {
        result: ChatLine[];
    }

    type ChatLine = [guid: string, time: number, PlextContainer];
    type MarkUp = (MarkUpPortal | MarkUpPlayer | MarkUpText | MarkUpFaction | MarkUpAtPlayer)[];
    type TeamStr = "RESISTANCE" | "ENLIGHTENED" | "NEUTRAL"; // TODO CHECK if "NEUTRAL" is valid

    interface PlextContainer {
        plext: {
            plextType: "SYSTEM_BROADCAST" | "SYSTEM_NARROWCAST" | "PLAYER_GENERATED";
            markup: MarkUp;
            team: TeamStr;
            text: string;
        };
    }

    type MarkUpPlayer = ["PLAYER", MarkUpPlayerType];
    type MarkUpAtPlayer = ["AT_PLAYER", MarkUpPlayerType];
    interface MarkUpPlayerType {
        team: TeamStr;
        plain: string;
    }

    type MarkUpFaction = ["FACTION", MarkUpFactionType];
    interface MarkUpFactionType {
        team: TeamStr | "ALIENS"; // TODO CHECK also check "NEUTRAL" here or in plain only
        plain: TeamStr | "ALIENS"; // TODO CHECK
    }

    type MarkUpText = ["TEXT", MarkUpTextType];
    interface MarkUpTextType {
        plain: string
        // incomplete. take as examples:
        | " destroyed a Resonator on "
        | " deployed a Resonator on "
        | " deployed a Beacon on "
        | " linked " | " to "
        | " created a Control Field @" | " +" | " Mus"
        | " captured "
        | " deployed a Very Rare Battle Beacon on "
        | " won a Very Rare Battle Beacon on "
        | " deployed a Rare Battle Beacon on "
        | " won a Rare Battle Beacon on "
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
