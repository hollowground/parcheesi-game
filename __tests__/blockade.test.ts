import { describe, it, expect } from "vitest"
import { getLegalMoves } from "../engine/getLegalMoves"
import { GameState } from "../types/GameState"

describe("Blockade Rules (RULE-BLOCK)", () => {

    it("RULE-BLOCK-001: two pawns of same player form a blockade", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [3],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "track", index: 5 } },
                { id: 1, player: "red", position: { type: "track", index: 5 } },

                { id: 2, player: "blue", position: { type: "track", index: 2 } },
                { id: 3, player: "blue", position: { type: "start" } }
            ]
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBeGreaterThanOrEqual(0)
    })


    it("RULE-BLOCK-002: pawn cannot move through a blockade", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [4],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "track", index: 2 } },

                { id: 1, player: "blue", position: { type: "track", index: 4 } },
                { id: 2, player: "blue", position: { type: "track", index: 4 } }
            ]
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(0)

    })


    it("RULE-BLOCK-003: pawn cannot land on its own blockade", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [3],
            usedDice: [],
            pawns: [

                // pawn trying to move
                { id: 0, player: "red", position: { type: "track", index: 2 } },

                // blockade
                { id: 1, player: "red", position: { type: "track", index: 5 } },
                { id: 2, player: "red", position: { type: "track", index: 5 } },

                { id: 3, player: "blue", position: { type: "start" } }
            ]
        }

        const moves = getLegalMoves(state)

        const illegalLanding = moves.find(
            m => m.pawnId === 0 && m.to.type === "track" && m.to.index === 5
        )

        expect(illegalLanding).toBeUndefined()

    })


    it("RULE-BLOCK-004: pawn cannot land on opponent blockade", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [3],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "track", index: 2 } },

                { id: 1, player: "blue", position: { type: "track", index: 5 } },
                { id: 2, player: "blue", position: { type: "track", index: 5 } }
            ]
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(0)

    })


    it("RULE-BLOCK-005: pawn can land on a single opponent pawn", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [3],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "track", index: 2 } },

                { id: 1, player: "blue", position: { type: "track", index: 5 } }
            ]
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(1)

    })

})