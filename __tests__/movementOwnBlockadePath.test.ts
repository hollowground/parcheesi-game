import { describe, it, expect } from "vitest"
import { getLegalMoves } from "../engine/getLegalMoves"
import { GameState } from "../types/GameState"

describe("Movement Rules - Own Blockade Path", () => {

    it("pawn cannot pass its own blockade", () => {

        const state: GameState = {
            currentPlayer: "red",
            dice: [4],
            usedDice: [],
            pawns: [
                {
                    id: 0,
                    player: "red",
                    position: { type: "track", index: 10 }
                },

                // own blockade
                {
                    id: 1,
                    player: "red",
                    position: { type: "track", index: 12 }
                },
                {
                    id: 2,
                    player: "red",
                    position: { type: "track", index: 12 }
                }
            ],
            players: []
        }

        const moves = getLegalMoves(state)

        expect(
            moves.some(m => m.pawnId === 0)
        ).toBe(false)

    })

})