import { describe, it, expect } from "vitest"
import { getLegalMoves } from "../engine/getLegalMoves"
import { GameState } from "../types/GameState"

describe("Movement Rules - Own Blockade", () => {

    it("pawn cannot land on a square with two of its own pawns", () => {

        const state: GameState = {
            currentPlayer: "red",
            dice: [3],
            usedDice: [],
            pawns: [
                {
                    id: 0,
                    player: "red",
                    position: { type: "track", index: 10 }
                },

                {
                    id: 1,
                    player: "red",
                    position: { type: "track", index: 13 }
                },

                {
                    id: 2,
                    player: "red",
                    position: { type: "track", index: 13 }
                }
                ,

                {
                    id: 3,
                    player: "red",
                    position: { type: "start" }
                }
            ],
            players: ["red", "blue", "yellow", "green"],
            bonusMoves: [],
            consecutiveDoubles: 0
        
        }

        const moves = getLegalMoves(state)

        expect(
            moves.some(m => m.pawnId === 0)
        ).toBe(false)

    })

})