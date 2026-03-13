import { PlayerColor } from "../types/GameState"

export const TRACK_LENGTH = 68
export const HOME_LENGTH = 7

export const ENTRY_INDEX: Record<PlayerColor, number> = {
    red: 0,
    blue: 17,
    yellow: 34,
    green: 51
}

export const HOME_ENTRY_INDEX: Record<PlayerColor, number> = {
    red: 63,
    blue: 12,
    yellow: 29,
    green: 46
}

export const SAFETY_SQUARES = [
    0,   // red entry
    7,
    12,
    17,  // blue entry
    24,
    29,
    34,  // yellow entry
    41,
    46   // green entry
]