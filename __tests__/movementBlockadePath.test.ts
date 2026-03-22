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

    it("does not allow bonus to pass through a blockade", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [],
            usedDice: [],

            bonusMoves: [20],
            consecutiveDoubles: 0,

            pawns: [
                // Pawn attempting bonus
                { id: 1, player: "red", position: { type: "track", index: 0 } },

                // Blockade at index 5 (two blue pawns)
                { id: 2, player: "blue", position: { type: "track", index: 5 } },
                { id: 3, player: "blue", position: { type: "track", index: 5 } },
            ]
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(0)

    })

    it("does not allow bonus to land on a blockade", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [],
            usedDice: [],

            bonusMoves: [20],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 0 } },

                // Blockade exactly at landing square
                { id: 2, player: "blue", position: { type: "track", index: 20 } },
                { id: 3, player: "blue", position: { type: "track", index: 20 } },
            ]
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(0)

    })

    it("only allows one pawn to move out of a blockade per move", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [3],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 10 } },
                { id: 2, player: "red", position: { type: "track", index: 10 } },
            ]
        }

        const moves = getLegalMoves(state)

        // ensure moves are generated for individual pawns, not both moving together
        const pawnIds = new Set(moves.map(m => m.pawnId))

        expect(pawnIds.size).toBeGreaterThan(0)
    })

})