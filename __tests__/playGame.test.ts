import { describe, it, expect } from "vitest"
import { playGame } from "../engine/playGame"
import { GameState } from "../types/GameState"

describe("Play Game Rules (RULE-PLAYGAME)", () => {

    it("plays until a winner is determined", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "home" } },
                { id: 2, player: "red", position: { type: "home" } },
                { id: 3, player: "red", position: { type: "home" } },
                { id: 4, player: "red", position: { type: "home" } },
                { id: 5, player: "blue", position: { type: "track", index: 0 } }
            ]
        }

        const strategy = () => 0 // always pick first move

        const result = playGame(state, {
            red: strategy,
            blue: strategy
        })

        expect(result.winner).toBeDefined()

    })

    it("declares correct winner when all pawns reach home", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "blue", position: { type: "home" } },
                { id: 2, player: "blue", position: { type: "home" } },
                { id: 3, player: "blue", position: { type: "home" } },
                { id: 4, player: "blue", position: { type: "home" } }
            ]
        }

        const result = playGame(state, {
            red: () => 0,
            blue: () => 0
        })

        // ❗ MUST be blue, not first player
        expect(result.winner).toBe("blue")

    })

    it("completes a full game without getting stuck", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [],
            usedDice: [],
            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 0 } },
                { id: 2, player: "red", position: { type: "track", index: 1 } },
                { id: 3, player: "red", position: { type: "track", index: 2 } },
                { id: 4, player: "red", position: { type: "track", index: 3 } },

                { id: 5, player: "blue", position: { type: "track", index: 10 } },
                { id: 6, player: "blue", position: { type: "track", index: 11 } },
                { id: 7, player: "blue", position: { type: "track", index: 12 } },
                { id: 8, player: "blue", position: { type: "track", index: 13 } },
            ]
        }

        const greedyStrategy = (moves: any[]) => {
            const index = moves.findIndex(m => m.to.type === 'home')
            if (index !== -1) return index

            return 0
        }

        const result = playGame(state, {
            red: greedyStrategy,
            blue: greedyStrategy
        })

        expect(result.winner).toBeDefined()

    })

})