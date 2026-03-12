import { describe, it, expect } from 'vitest'
import { getLegalMoves } from "../engine/getLegalMoves"
import { GameState } from "../types/GameState"

describe("Entry Rules (RULE-ENTRY)", () => {

    it("RULE-ENTRY-001: pawn can enter board with roll of 5", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],

            currentPlayer: "red",

            dice: [5],
            usedDice: [],

            pawns: [
                { id: 0, player: "red", position: { type: "start" } },
                { id: 1, player: "red", position: { type: "start" } },
                { id: 2, player: "red", position: { type: "start" } },
                { id: 3, player: "red", position: { type: "start" } }
            ]
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBeGreaterThan(0)
    })

    it("RULE-ENTRY-001: pawn cannot enter without rolling a 5", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [3],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "start" } },
                { id: 1, player: "red", position: { type: "start" } },
                { id: 2, player: "red", position: { type: "start" } },
                { id: 3, player: "red", position: { type: "start" } }
            ]
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(0)
    })

    it("RULE-ENTRY-001: multiple pawns in start generate multiple entry moves", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [5],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "start" } },
                { id: 1, player: "red", position: { type: "start" } },
                { id: 2, player: "red", position: { type: "start" } },
                { id: 3, player: "red", position: { type: "start" } }
            ]
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(2)
    })

    it("RULE-ENTRY-002: entry is blocked if two pawns occupy the entry square (blockade)", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [5],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "start" } },
                { id: 1, player: "red", position: { type: "start" } },

                { id: 2, player: "red", position: { type: "track", index: 0 } },
                { id: 3, player: "red", position: { type: "track", index: 0 } }
            ]
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(0)

    })

    it("RULE-ENTRY-002: entry allowed if only one pawn occupies entry square", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "red",
            dice: [5],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "start" } },

                { id: 1, player: "red", position: { type: "track", index: 0 } },

                { id: 2, player: "blue", position: { type: "start" } },
                { id: 3, player: "blue", position: { type: "start" } }
            ]
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(1)

    })

    it("RULE-ENTRY-001: only current player's pawns can enter from start", () => {

        const state: GameState = {
            players: ["red", "blue", "yellow", "green"],
            currentPlayer: "blue",
            dice: [5],
            usedDice: [],
            pawns: [
                { id: 0, player: "red", position: { type: "start" } },
                { id: 1, player: "red", position: { type: "start" } },

                { id: 2, player: "blue", position: { type: "start" } },
                { id: 3, player: "blue", position: { type: "start" } }
            ]
        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBe(2)

    })

})