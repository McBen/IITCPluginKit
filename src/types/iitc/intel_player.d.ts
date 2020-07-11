declare namespace Intel {
    interface PlayerInfo {
        nickname: string;
        team: string;
        ap: string;
        available_invites: number;
        energy: number;
        level: number;
        min_ap_for_current_level: string;
        min_ap_for_next_level: string;
        nickMatcher: RegExp;
        verified_level: number;
        xm_capacity: string;
    }
}
