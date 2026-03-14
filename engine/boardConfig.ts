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
    ENTRY_INDEX.red,   // red entry
    7,
    12,
    ENTRY_INDEX.blue,  // blue entry
    24,
    29,
    ENTRY_INDEX.yellow,  // yellow entry
    41,
    ENTRY_INDEX.green   // green entry
]

export const START_OFFSET = 5

export const PLAYER_ORDER: PlayerColor[] = [
    "red",
    "blue",
    "yellow",
    "green"
]