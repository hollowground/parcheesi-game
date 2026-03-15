import { describe, it, expect } from "vitest"
import { getLegalMoves } from "../engine/getLegalMoves"
import { GameState } from "../types/GameState"

describe("Movement Rules - Blockade Path", () => {

    it("pawn cannot move through a blockade", () => {

        const state: GameState = {
            currentPlayer: "red",
            dice: [3],
            usedDice: [],

            pawns: [
                // moving pawn
                {
                    id: 0,
                    player: "red",
                    position: { type: "track", index: 10 }
                },

                // blockade
                {
                    id: 1,
                    player: "blue",
                    position: { type: "track", index: 12 }
                },
                {
                    id: 2,
                    player: "blue",
                    position: { type: "track", index: 12 }
                }
            ],
            players: [],
            bonusMoves: [],
            consecutiveDoubles: 0
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(0)

    })

})