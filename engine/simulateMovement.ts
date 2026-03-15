import { HOME_ENTRY_INDEX, HOME_LENGTH, TRACK_LENGTH } from "./boardConfig"
import { isBlockade } from "./boardUtils"
import { GameState, PlayerColor, Position, Pawn } from "../types/GameState"

export function simulateMovement(
    state: GameState,
    pawn: Pawn,
    die: number
): Position | null {

    let pos = pawn.position

    for (let step = 0; step < die; step++) {

        const next = getNextPosition(pawn.player, pos)

        if (!next) return null

        // cannot pass through blockade
        if (
            step < die - 1 &&
            next.type === "track" &&
            isBlockade(state, next.index)
        ) {
            return null
        }

        pos = next
    }

    return pos
}

function getNextPosition(
    player: PlayerColor,
    pos: Position
): Position | null {

    if (pos.type === "track") {

        const next = (pos.index + 1) % TRACK_LENGTH

        if (next === HOME_ENTRY_INDEX[player]) {
            return { type: "homeLane", index: 0 }
        }

        return { type: "track", index: next }
    }

    if (pos.type === "homeLane") {

        const next = pos.index + 1

        if (next === HOME_LENGTH - 1) {
            return { type: "home" }
        }

        if (next >= HOME_LENGTH) {
            return null
        }

        return {
            type: "homeLane",
            index: next
        }
    }

    return null
}